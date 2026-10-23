import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';

interface Book { id: number; title: string; author: string; isbn: string; category: string; copies: number; available: number; borrowedBy?: string; }

const INITIAL: Book[] = [
  { id:1,  title:'Introduction to Algorithms',    author:'Cormen et al.',      isbn:'978-0-262-03384-8', category:'Computer Science', copies:5, available:3 },
  { id:2,  title:'Operating System Concepts',     author:'Silberschatz',       isbn:'978-0-470-12872-5', category:'Computer Science', copies:4, available:1, borrowedBy:'Alice Johnson' },
  { id:3,  title:'Calculus: Early Transcendentals',author:'James Stewart',     isbn:'978-1-285-74155-0', category:'Mathematics',      copies:6, available:6 },
  { id:4,  title:'Molecular Biology of the Cell', author:'Alberts et al.',     isbn:'978-0-393-88491-0', category:'Biology',           copies:3, available:2 },
  { id:5,  title:'Principles of Economics',       author:'N. Gregory Mankiw',  isbn:'978-1-337-09453-8', category:'Business',          copies:7, available:5 },
  { id:6,  title:'Engineering Thermodynamics',    author:'P.K. Nag',           isbn:'978-1-259-06201-6', category:'Engineering',       copies:4, available:0, borrowedBy:'Daniel Kim' },
  { id:7,  title:'Organic Chemistry',             author:'Paula Bruice',       isbn:'978-0-321-80322-1', category:'Chemistry',         copies:5, available:4 },
  { id:8,  title:'The Great Gatsby',              author:'F. Scott Fitzgerald', isbn:'978-0-7432-7356-5', category:'Literature',        copies:3, available:3 },
];

const blank: Book = { id:0, title:'', author:'', isbn:'', category:'', copies:1, available:1 };

export default function LibraryPage() {
  const { role } = useAuth();
  const canManage = role === 'admin' || role === 'teacher';
  const [list, setList] = useState<Book[]>(INITIAL);
  const [q, setQ] = useState('');
  const [show, setShow] = useState(false);
  const [form, setForm] = useState<Book>(blank);
  const [editing, setEditing] = useState(false);
  const [issueModal, setIssueModal] = useState<Book | null>(null);
  const [borrower, setBorrower] = useState('');

  const filtered = list.filter(b =>
    b.title.toLowerCase().includes(q.toLowerCase()) ||
    b.author.toLowerCase().includes(q.toLowerCase()) ||
    b.category.toLowerCase().includes(q.toLowerCase())
  );

  const ch = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
    setForm(f => ({ ...f, [e.target.name]: e.target.type === 'number' ? +e.target.value : e.target.value }));

  function openAdd() { setForm({ ...blank, id: Date.now() }); setEditing(false); setShow(true); }
  function openEdit(b: Book) { setForm(b); setEditing(true); setShow(true); }
  function del(id: number) { if (confirm('Remove book?')) setList(p => p.filter(b => b.id !== id)); }
  function save(e: React.FormEvent) {
    e.preventDefault();
    if (!form.title.trim()) return alert('Title required');
    if (editing) setList(p => p.map(b => b.id === form.id ? form : b));
    else setList(p => [form, ...p]);
    setShow(false);
  }
  function issueBook(e: React.FormEvent) {
    e.preventDefault();
    if (!issueModal || !borrower.trim()) return;
    setList(p => p.map(b => b.id === issueModal.id ? { ...b, available: b.available - 1, borrowedBy: borrower } : b));
    setIssueModal(null); setBorrower('');
  }
  function returnBook(id: number) {
    setList(p => p.map(b => b.id === id ? { ...b, available: b.available + 1, borrowedBy: undefined } : b));
  }

  return (
    <section className="container">
      <header className="page-header">
        <div><h1>Library</h1><p className="muted">Book catalogue, issue and return management.</p></div>
        <div className="toolbar">
          <input className="search" value={q} onChange={e => setQ(e.target.value)} placeholder="Search title, author, category…" />
          {canManage && <button className="btn-gold" onClick={openAdd}>+ Add Book</button>}
        </div>
      </header>

      <div className="grid-3" style={{ marginBottom: 18 }}>
        <div className="stat-card"><div className="stat-icon">📚</div><div><div className="stat-value">{list.reduce((s,b)=>s+b.copies,0)}</div><div className="stat-label">Total Books</div></div></div>
        <div className="stat-card"><div className="stat-icon">✅</div><div><div className="stat-value">{list.reduce((s,b)=>s+b.available,0)}</div><div className="stat-label">Available</div></div></div>
        <div className="stat-card"><div className="stat-icon">📤</div><div><div className="stat-value">{list.filter(b=>b.available < b.copies).length}</div><div className="stat-label">Books Issued</div></div></div>
      </div>

      <div className="table-card">
        <table className="uni-table">
          <thead><tr><th>Title</th><th>Author</th><th>Category</th><th>Copies</th><th>Available</th>{canManage && <><th>Issued To</th><th>Actions</th></>}</tr></thead>
          <tbody>
            {filtered.length === 0
              ? <tr className="empty-row"><td colSpan={canManage ? 7 : 5}>No books found</td></tr>
              : filtered.map(b => (
                <tr key={b.id}>
                  <td style={{ fontWeight: 600 }}>{b.title}</td>
                  <td className="muted">{b.author}</td>
                  <td>{b.category}</td>
                  <td>{b.copies}</td>
                  <td>
                    <span className={`badge ${b.available === 0 ? 'badge-red' : b.available < b.copies ? 'badge-yellow' : 'badge-green'}`}>
                      {b.available}/{b.copies}
                    </span>
                  </td>
                  {canManage && <td className="muted">{b.borrowedBy ?? '—'}</td>}
                  {canManage && <td style={{ display: 'flex', gap: 6 }}>
                    {b.available > 0
                      ? <button className="btn-gold btn-sm" onClick={() => { setIssueModal(b); setBorrower(''); }}>Issue</button>
                      : <button className="btn-muted btn-sm" onClick={() => returnBook(b.id)}>Return</button>}
                    <button className="btn-muted btn-sm" onClick={() => openEdit(b)}>Edit</button>
                    <button className="btn-danger" onClick={() => del(b.id)}>Delete</button>
                  </td>}
                </tr>
              ))}
          </tbody>
        </table>
      </div>

      {canManage && show && (
        <div className="modal-backdrop">
          <form className="modal" onSubmit={save}>
            <h3>{editing ? 'Edit Book' : 'Add Book'}</h3>
            <label>Title    <input name="title"    value={form.title}    onChange={ch} /></label>
            <label>Author   <input name="author"   value={form.author}   onChange={ch} /></label>
            <label>ISBN     <input name="isbn"     value={form.isbn}     onChange={ch} /></label>
            <label>Category <input name="category" value={form.category} onChange={ch} /></label>
            <label>Copies   <input name="copies"   value={form.copies}   onChange={ch} type="number" min={1} /></label>
            <label>Available<input name="available"value={form.available}onChange={ch} type="number" min={0} /></label>
            <div className="modal-actions">
              <button type="button" className="btn-muted" onClick={() => setShow(false)}>Cancel</button>
              <button type="submit" className="btn-gold">Save</button>
            </div>
          </form>
        </div>
      )}

      {canManage && issueModal && (
        <div className="modal-backdrop">
          <form className="modal" onSubmit={issueBook} style={{ minWidth: 300 }}>
            <h3>Issue Book</h3>
            <p style={{ fontSize: 13, color: 'var(--muted)', marginBottom: 8 }}><strong>{issueModal.title}</strong></p>
            <label>Borrower Name
              <input value={borrower} onChange={e => setBorrower(e.target.value)} placeholder="Student name" />
            </label>
            <div className="modal-actions">
              <button type="button" className="btn-muted" onClick={() => setIssueModal(null)}>Cancel</button>
              <button type="submit" className="btn-gold">Issue</button>
            </div>
          </form>
        </div>
      )}
    </section>
  );
}
