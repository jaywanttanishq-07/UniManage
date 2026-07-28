import { useState } from 'react';

interface Course { id: string; name: string; dept: string; credits: number; instructor: string; students: number; status: string; }

const INITIAL: Course[] = [
  { id: 'CS101', name: 'Introduction to Computer Science', dept: 'Computer Science', credits: 4, instructor: 'Dr. Sarah Mitchell', students: 68, status: 'Active' },
  { id: 'CS302', name: 'Data Structures & Algorithms',     dept: 'Computer Science', credits: 4, instructor: 'Dr. Sarah Mitchell', students: 52, status: 'Active' },
  { id: 'ME201', name: 'Thermodynamics',                   dept: 'Mechanical Eng.',  credits: 3, instructor: 'Prof. James Carter',  students: 45, status: 'Active' },
  { id: 'BIO150', name: 'General Biology',                 dept: 'Biology',          credits: 3, instructor: 'Prof. Nina Roberts',  students: 71, status: 'Active' },
  { id: 'BUS201', name: 'Principles of Management',        dept: 'Business',         credits: 3, instructor: 'Prof. Alan Wright',   students: 88, status: 'Active' },
  { id: 'MTH201', name: 'Linear Algebra',                  dept: 'Mathematics',      credits: 4, instructor: 'Dr. Li Wei',          students: 39, status: 'Inactive' },
  { id: 'CHM101', name: 'Organic Chemistry',               dept: 'Chemistry',        credits: 4, instructor: 'Dr. Priya Sharma',    students: 33, status: 'Active' },
];

const blank: Course = { id: '', name: '', dept: '', credits: 3, instructor: '', students: 0, status: 'Active' };

export default function Courses() {
  const [list, setList] = useState<Course[]>(INITIAL);
  const [q, setQ] = useState('');
  const [show, setShow] = useState(false);
  const [form, setForm] = useState<Course>(blank);
  const [editing, setEditing] = useState(false);

  const filtered = list.filter(c =>
    c.name.toLowerCase().includes(q.toLowerCase()) ||
    c.id.toLowerCase().includes(q.toLowerCase()) ||
    c.dept.toLowerCase().includes(q.toLowerCase())
  );

  const ch = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
    setForm(f => ({ ...f, [e.target.name]: e.target.type === 'number' ? +e.target.value : e.target.value }));

  function openAdd() { setForm({ ...blank }); setEditing(false); setShow(true); }
  function openEdit(c: Course) { setForm(c); setEditing(true); setShow(true); }
  function del(id: string) { if (confirm('Delete course?')) setList(p => p.filter(c => c.id !== id)); }
  function save(e: React.FormEvent) {
    e.preventDefault();
    if (!form.id.trim() || !form.name.trim()) return alert('Code and name required');
    if (editing) setList(p => p.map(c => c.id === form.id ? form : c));
    else setList(p => [form, ...p]);
    setShow(false);
  }

  return (
    <section className="container">
      <header className="page-header">
        <div><h1>Courses</h1><p className="muted">Manage course catalogue and assignments.</p></div>
        <div className="toolbar">
          <input className="search" value={q} onChange={e => setQ(e.target.value)} placeholder="Search name, code, dept…" />
          <button className="btn-gold" onClick={openAdd}>+ Add Course</button>
        </div>
      </header>

      <div className="table-card">
        <table className="uni-table">
          <thead><tr><th>Code</th><th>Course Name</th><th>Department</th><th>Credits</th><th>Instructor</th><th>Students</th><th>Status</th><th>Actions</th></tr></thead>
          <tbody>
            {filtered.length === 0
              ? <tr className="empty-row"><td colSpan={8}>No courses found</td></tr>
              : filtered.map(c => (
                <tr key={c.id}>
                  <td style={{ fontWeight: 700, color: 'var(--gold)' }}>{c.id}</td>
                  <td style={{ fontWeight: 600 }}>{c.name}</td>
                  <td>{c.dept}</td>
                  <td>{c.credits}</td>
                  <td className="muted">{c.instructor}</td>
                  <td>{c.students}</td>
                  <td><span className={`badge ${c.status === 'Active' ? 'badge-green' : 'badge-gray'}`}>{c.status}</span></td>
                  <td style={{ display: 'flex', gap: 6 }}>
                    <button className="btn-muted btn-sm" onClick={() => openEdit(c)}>Edit</button>
                    <button className="btn-danger" onClick={() => del(c.id)}>Delete</button>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>

      {show && (
        <div className="modal-backdrop">
          <form className="modal" onSubmit={save}>
            <h3>{editing ? 'Edit Course' : 'Add Course'}</h3>
            <label>Course Code <input name="id"         value={form.id}         onChange={ch} disabled={editing} /></label>
            <label>Course Name <input name="name"       value={form.name}       onChange={ch} /></label>
            <label>Department  <input name="dept"       value={form.dept}       onChange={ch} /></label>
            <label>Credits     <input name="credits"    value={form.credits}    onChange={ch} type="number" min={1} max={6} /></label>
            <label>Instructor  <input name="instructor" value={form.instructor} onChange={ch} /></label>
            <label>Status
              <select name="status" value={form.status} onChange={ch}>
                {['Active','Inactive'].map(s => <option key={s}>{s}</option>)}
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
