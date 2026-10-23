import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';

interface Exam { id: number; subject: string; code: string; date: string; time: string; room: string; duration: string; type: string; }

const INITIAL: Exam[] = [
  { id: 1, subject: 'Introduction to Computer Science', code: 'CS101',  date: '2026-07-30', time: '09:00', room: 'Hall-A', duration: '3 hrs',   type: 'Mid-Term' },
  { id: 2, subject: 'Linear Algebra',                   code: 'MTH201', date: '2026-07-31', time: '09:00', room: 'Hall-B', duration: '3 hrs',   type: 'Mid-Term' },
  { id: 3, subject: 'General Biology',                  code: 'BIO150', date: '2026-08-01', time: '11:00', room: 'Hall-C', duration: '2.5 hrs', type: 'Mid-Term' },
  { id: 4, subject: 'Principles of Management',         code: 'BUS201', date: '2026-08-02', time: '09:00', room: 'Hall-A', duration: '3 hrs',   type: 'Mid-Term' },
  { id: 5, subject: 'Thermodynamics',                   code: 'ME201',  date: '2026-08-04', time: '02:00', room: 'Hall-D', duration: '3 hrs',   type: 'Mid-Term' },
  { id: 6, subject: 'Organic Chemistry',                code: 'CHM101', date: '2026-08-05', time: '09:00', room: 'Lab-1', duration: '3 hrs',   type: 'Mid-Term' },
  { id: 7, subject: 'Data Structures & Algorithms',     code: 'CS302',  date: '2026-10-10', time: '09:00', room: 'Hall-A', duration: '3 hrs',   type: 'Final' },
];

const blank: Exam = { id: 0, subject: '', code: '', date: '', time: '09:00', room: '', duration: '3 hrs', type: 'Mid-Term' };

export default function Exams() {
  const { role } = useAuth();
  const canManage = role === 'admin' || role === 'teacher';
  const [list, setList] = useState<Exam[]>(INITIAL);
  const [q, setQ] = useState('');
  const [filter, setFilter] = useState('All');
  const [show, setShow] = useState(false);
  const [form, setForm] = useState<Exam>(blank);
  const [editing, setEditing] = useState(false);

  const filtered = list
    .filter(e => filter === 'All' || e.type === filter)
    .filter(e => e.subject.toLowerCase().includes(q.toLowerCase()) || e.code.toLowerCase().includes(q.toLowerCase()));

  const ch = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
    setForm(f => ({ ...f, [e.target.name]: e.target.value }));

  function openAdd() { setForm({ ...blank, id: Date.now() }); setEditing(false); setShow(true); }
  function openEdit(ex: Exam) { setForm(ex); setEditing(true); setShow(true); }
  function del(id: number) { if (confirm('Delete exam?')) setList(p => p.filter(e => e.id !== id)); }
  function save(e: React.FormEvent) {
    e.preventDefault();
    if (!form.subject.trim() || !form.date) return alert('Subject and date required');
    if (editing) setList(p => p.map(ex => ex.id === form.id ? form : ex));
    else setList(p => [...p, form].sort((a, b) => a.date.localeCompare(b.date)));
    setShow(false);
  }

  return (
    <section className="container">
      <header className="page-header">
        <div><h1>Exams</h1><p className="muted">Examination schedule and hall assignments.</p></div>
        <div className="toolbar">
          <input className="search" value={q} onChange={e => setQ(e.target.value)} placeholder="Search subject or code…" />
          {(['All','Mid-Term','Final'] as const).map(t => (
            <button key={t} className={filter === t ? 'btn-gold btn-sm' : 'btn-muted btn-sm'} onClick={() => setFilter(t)}>{t}</button>
          ))}
          {canManage && <button className="btn-gold" onClick={openAdd}>+ Add Exam</button>}
        </div>
      </header>

      <div className="table-card">
        <table className="uni-table">
          <thead><tr><th>Subject</th><th>Code</th><th>Date</th><th>Time</th><th>Room</th><th>Duration</th><th>Type</th>{canManage && <th>Actions</th>}</tr></thead>
          <tbody>
            {filtered.length === 0
              ? <tr className="empty-row"><td colSpan={canManage ? 8 : 7}>No exams found</td></tr>
              : filtered.map(ex => (
                <tr key={ex.id}>
                  <td style={{ fontWeight: 600 }}>{ex.subject}</td>
                  <td style={{ color: 'var(--gold)', fontWeight: 700 }}>{ex.code}</td>
                  <td>{new Date(ex.date).toLocaleDateString('en-GB', { day:'numeric', month:'short', year:'numeric' })}</td>
                  <td>{ex.time}</td>
                  <td>{ex.room}</td>
                  <td>{ex.duration}</td>
                  <td><span className={`badge ${ex.type === 'Final' ? 'badge-red' : 'badge-yellow'}`}>{ex.type}</span></td>
                  {canManage && <td style={{ display: 'flex', gap: 6 }}>
                    <button className="btn-muted btn-sm" onClick={() => openEdit(ex)}>Edit</button>
                    <button className="btn-danger" onClick={() => del(ex.id)}>Delete</button>
                  </td>}
                </tr>
              ))}
          </tbody>
        </table>
      </div>

      {canManage && show && (
        <div className="modal-backdrop">
          <form className="modal" onSubmit={save}>
            <h3>{editing ? 'Edit Exam' : 'Add Exam'}</h3>
            <label>Subject  <input name="subject"  value={form.subject}  onChange={ch} /></label>
            <label>Code     <input name="code"     value={form.code}     onChange={ch} /></label>
            <label>Date     <input name="date"     value={form.date}     onChange={ch} type="date" /></label>
            <label>Time     <input name="time"     value={form.time}     onChange={ch} type="time" /></label>
            <label>Room     <input name="room"     value={form.room}     onChange={ch} /></label>
            <label>Duration <input name="duration" value={form.duration} onChange={ch} placeholder="3 hrs" /></label>
            <label>Type
              <select name="type" value={form.type} onChange={ch}>
                {['Mid-Term','Final','Supplementary'].map(t => <option key={t}>{t}</option>)}
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
