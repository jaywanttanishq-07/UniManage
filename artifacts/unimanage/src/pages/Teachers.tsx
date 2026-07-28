import { useState } from 'react';

interface Teacher { id: number; name: string; subject: string; dept: string; email: string; phone: string; status: string; }

const INITIAL: Teacher[] = [
  { id: 201, name: 'Dr. Sarah Mitchell',  subject: 'Data Structures',    dept: 'Computer Science', email: 'sarah.m@uni.edu', phone: '555-1001', status: 'Active' },
  { id: 202, name: 'Prof. James Carter',  subject: 'Thermodynamics',     dept: 'Mechanical Eng.',  email: 'james.c@uni.edu', phone: '555-1002', status: 'Active' },
  { id: 203, name: 'Dr. Priya Sharma',    subject: 'Organic Chemistry',  dept: 'Chemistry',        email: 'priya.s@uni.edu', phone: '555-1003', status: 'Active' },
  { id: 204, name: 'Prof. Alan Wright',   subject: 'Microeconomics',     dept: 'Business',         email: 'alan.w@uni.edu',  phone: '555-1004', status: 'On Leave' },
  { id: 205, name: 'Dr. Li Wei',          subject: 'Linear Algebra',     dept: 'Mathematics',      email: 'li.w@uni.edu',    phone: '555-1005', status: 'Active' },
  { id: 206, name: 'Prof. Nina Roberts',  subject: 'Genetics',           dept: 'Biology',          email: 'nina.r@uni.edu',  phone: '555-1006', status: 'Active' },
];

const blank: Teacher = { id: 0, name: '', subject: '', dept: '', email: '', phone: '', status: 'Active' };

export default function Teachers() {
  const [list, setList] = useState<Teacher[]>(INITIAL);
  const [q, setQ] = useState('');
  const [show, setShow] = useState(false);
  const [form, setForm] = useState<Teacher>(blank);
  const [editing, setEditing] = useState(false);

  const filtered = list.filter(t =>
    t.name.toLowerCase().includes(q.toLowerCase()) ||
    t.subject.toLowerCase().includes(q.toLowerCase()) ||
    t.dept.toLowerCase().includes(q.toLowerCase())
  );

  const ch = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
    setForm(f => ({ ...f, [e.target.name]: e.target.value }));

  function openAdd() { setForm({ ...blank, id: Date.now() }); setEditing(false); setShow(true); }
  function openEdit(t: Teacher) { setForm(t); setEditing(true); setShow(true); }
  function del(id: number) { if (confirm('Remove this teacher?')) setList(p => p.filter(t => t.id !== id)); }
  function save(e: React.FormEvent) {
    e.preventDefault();
    if (!form.name.trim()) return alert('Name required');
    if (editing) setList(p => p.map(t => t.id === form.id ? form : t));
    else setList(p => [form, ...p]);
    setShow(false);
  }

  return (
    <section className="container">
      <header className="page-header">
        <div><h1>Teachers</h1><p className="muted">Manage faculty records and assignments.</p></div>
        <div className="toolbar">
          <input className="search" value={q} onChange={e => setQ(e.target.value)} placeholder="Search name, subject, dept…" />
          <button className="btn-gold" onClick={openAdd}>+ Add Teacher</button>
        </div>
      </header>

      <div className="table-card">
        <table className="uni-table">
          <thead><tr><th>ID</th><th>Name</th><th>Subject</th><th>Department</th><th>Email</th><th>Phone</th><th>Status</th><th>Actions</th></tr></thead>
          <tbody>
            {filtered.length === 0
              ? <tr className="empty-row"><td colSpan={8}>No teachers found</td></tr>
              : filtered.map(t => (
                <tr key={t.id}>
                  <td>{t.id}</td>
                  <td style={{ fontWeight: 600 }}>{t.name}</td>
                  <td>{t.subject}</td>
                  <td>{t.dept}</td>
                  <td className="muted">{t.email}</td>
                  <td className="muted">{t.phone}</td>
                  <td><span className={`badge ${t.status === 'Active' ? 'badge-green' : 'badge-yellow'}`}>{t.status}</span></td>
                  <td style={{ display: 'flex', gap: 6 }}>
                    <button className="btn-muted btn-sm" onClick={() => openEdit(t)}>Edit</button>
                    <button className="btn-danger" onClick={() => del(t.id)}>Delete</button>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>

      {show && (
        <div className="modal-backdrop">
          <form className="modal" onSubmit={save}>
            <h3>{editing ? 'Edit Teacher' : 'Add Teacher'}</h3>
            <label>Full Name<input name="name"    value={form.name}    onChange={ch} /></label>
            <label>Subject  <input name="subject" value={form.subject} onChange={ch} /></label>
            <label>Department<input name="dept"   value={form.dept}    onChange={ch} /></label>
            <label>Email    <input name="email"   value={form.email}   onChange={ch} /></label>
            <label>Phone    <input name="phone"   value={form.phone}   onChange={ch} /></label>
            <label>Status
              <select name="status" value={form.status} onChange={ch}>
                {['Active','On Leave','Inactive'].map(s => <option key={s}>{s}</option>)}
              </select>
            </label>
            <div className="modal-actions">
              <button type="button" className="btn-muted" onClick={() => setShow(false)}>Cancel</button>
              <button type="submit" className="btn-gold">Save</button>
            </div>
          </form>
        </div>
      )}
    </section>
  );
}
