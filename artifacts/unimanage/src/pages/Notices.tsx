import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';

interface Notice { id: number; title: string; category: string; date: string; content: string; priority: string; author: string; }

const INITIAL: Notice[] = [
  { id:1, title:'Holiday on 30th July 2026',            category:'General',    date:'2026-07-25', priority:'High',   author:'Admin Office',    content:'The university will remain closed on 30th July 2026 on account of a national holiday. All classes and examinations scheduled for that day will be rescheduled. Students are advised to check the updated schedule on the portal.' },
  { id:2, title:'Mid-Term Exam Schedule Released',       category:'Exam',       date:'2026-07-24', priority:'High',   author:'Examination Cell', content:'The mid-term examination schedule for all departments has been released. Students must carry their admit cards and follow the seating arrangement displayed outside the examination hall.' },
  { id:3, title:'Fee Payment Deadline — Semester 3 & 5',category:'Finance',    date:'2026-07-22', priority:'Medium', author:'Finance Dept.',   content:'Students of Semester 3 and 5 are reminded that the last date for fee payment is 2nd August 2026. A fine of ₹500 per day will be levied for late payments. Contact the accounts office for any queries.' },
  { id:4, title:'Library Catalogue Updated',            category:'Library',    date:'2026-07-20', priority:'Low',    author:'Library Office',  content:'Over 200 new books have been added to the library catalogue across all departments. Students can search for available titles on the library portal or visit the library.' },
  { id:5, title:'Faculty Development Programme — Aug 5',category:'Academic',   date:'2026-07-18', priority:'Medium', author:'Academic Office',  content:'A Faculty Development Programme will be held on 5th August 2026 in the Seminar Hall. All faculty members are requested to attend. The programme will cover advanced pedagogical techniques.' },
  { id:6, title:'Transport Route B — Stop Added',       category:'Transport',  date:'2026-07-15', priority:'Low',    author:'Transport Office', content:'A new stop at South Gate has been added to Transport Route B effective immediately. The revised schedule is available on the university website.' },
];

const priorityBadge: Record<string, string> = { High: 'badge-red', Medium: 'badge-yellow', Low: 'badge-green' };

const blank: Notice = { id:0, title:'', category:'General', date:'', content:'', priority:'Medium', author:'' };

export default function Notices() {
  const { role } = useAuth();
  const canManage = role === 'admin' || role === 'teacher';
  const [list, setList] = useState<Notice[]>(INITIAL);
  const [q, setQ] = useState('');
  const [filter, setFilter] = useState('All');
  const [show, setShow] = useState(false);
  const [view, setView] = useState<Notice | null>(null);
  const [form, setForm] = useState<Notice>(blank);
  const [editing, setEditing] = useState(false);

  const cats = ['All', ...Array.from(new Set(list.map(n => n.category)))];

  const filtered = list
    .filter(n => filter === 'All' || n.category === filter)
    .filter(n => n.title.toLowerCase().includes(q.toLowerCase()));

  const ch = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) =>
    setForm(f => ({ ...f, [e.target.name]: e.target.value }));

  function openAdd() { setForm({ ...blank, id: Date.now(), date: new Date().toISOString().split('T')[0] }); setEditing(false); setShow(true); }
  function openEdit(n: Notice) { setForm(n); setEditing(true); setShow(true); }
  function del(id: number) { if (confirm('Delete notice?')) setList(p => p.filter(n => n.id !== id)); }
  function save(e: React.FormEvent) {
    e.preventDefault();
    if (!form.title.trim()) return alert('Title required');
    if (editing) setList(p => p.map(n => n.id === form.id ? form : n));
    else setList(p => [form, ...p]);
    setShow(false);
  }

  return (
    <section className="container">
      <header className="page-header">
        <div><h1>Notices</h1><p className="muted">University announcements and circulars.</p></div>
        <div className="toolbar">
          <input className="search" value={q} onChange={e => setQ(e.target.value)} placeholder="Search notices…" />
          {canManage && <button className="btn-gold" onClick={openAdd}>+ Post Notice</button>}
        </div>
      </header>

      <div style={{ display: 'flex', gap: 8, marginBottom: 18, flexWrap: 'wrap' }}>
        {cats.map(c => (
          <button key={c} className={filter === c ? 'btn-gold btn-sm' : 'btn-muted btn-sm'} onClick={() => setFilter(c)}>{c}</button>
        ))}
      </div>

      {filtered.length === 0 && <p className="muted" style={{ textAlign: 'center', padding: '30px 0' }}>No notices found</p>}

      {filtered.map(n => (
        <div key={n.id} className="notice-card" onClick={() => setView(n)}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 10 }}>
            <div>
              <h4>{n.title}</h4>
              <div className="notice-meta">
                {n.date} &nbsp;·&nbsp; {n.category} &nbsp;·&nbsp; {n.author}
              </div>
            </div>
            <div style={{ display: 'flex', gap: 6, alignItems: 'center', flexShrink: 0 }}>
              <span className={`badge ${priorityBadge[n.priority]}`}>{n.priority}</span>
              {canManage && <>
                <button className="btn-muted btn-sm" onClick={e => { e.stopPropagation(); openEdit(n); }}>Edit</button>
                <button className="btn-danger" onClick={e => { e.stopPropagation(); del(n.id); }}>Delete</button>
              </>}
            </div>
          </div>
          <p style={{ margin: '8px 0 0', fontSize: 13, color: 'rgba(207,207,207,0.5)', lineHeight: 1.5 }}>
            {n.content.slice(0, 120)}…
          </p>
        </div>
      ))}

      {/* View Modal */}
      {view && (
        <div className="modal-backdrop" onClick={() => setView(null)}>
          <div className="modal" style={{ maxWidth: 540 }} onClick={e => e.stopPropagation()}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
              <h3 style={{ margin: 0, flex: 1, paddingRight: 12 }}>{view.title}</h3>
              <span className={`badge ${priorityBadge[view.priority]}`}>{view.priority}</span>
            </div>
            <div style={{ fontSize: 12, color: 'rgba(207,207,207,0.45)', marginBottom: 14 }}>
              {view.date} &nbsp;·&nbsp; {view.category} &nbsp;·&nbsp; {view.author}
            </div>
            <p style={{ fontSize: 14, lineHeight: 1.7, color: 'var(--muted)', margin: 0 }}>{view.content}</p>
            <div className="modal-actions"><button className="btn-gold" onClick={() => setView(null)}>Close</button></div>
          </div>
        </div>
      )}

      {/* Edit/Add Modal */}
      {canManage && show && (
        <div className="modal-backdrop">
          <form className="modal" onSubmit={save} style={{ maxWidth: 500 }}>
            <h3>{editing ? 'Edit Notice' : 'Post Notice'}</h3>
            <label>Title    <input name="title"    value={form.title}    onChange={ch} /></label>
            <label>Category
              <select name="category" value={form.category} onChange={ch}>
                {['General','Exam','Finance','Library','Academic','Transport','Hostel'].map(c => <option key={c}>{c}</option>)}
              </select>
            </label>
            <label>Priority
              <select name="priority" value={form.priority} onChange={ch}>
                {['High','Medium','Low'].map(p => <option key={p}>{p}</option>)}
              </select>
            </label>
            <label>Date     <input name="date"   value={form.date}   onChange={ch} type="date" /></label>
            <label>Author   <input name="author" value={form.author} onChange={ch} /></label>
            <label>Content  <textarea name="content" value={form.content} onChange={ch} rows={4} /></label>
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
