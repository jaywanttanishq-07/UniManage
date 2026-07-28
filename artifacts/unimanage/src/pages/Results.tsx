import { useState } from 'react';

interface Result { id: number; studentId: number; name: string; course: string; code: string; marks: number; total: number; grade: string; term: string; }

function gradeOf(pct: number) {
  if (pct >= 90) return 'A+';
  if (pct >= 80) return 'A';
  if (pct >= 70) return 'B';
  if (pct >= 60) return 'C';
  if (pct >= 50) return 'D';
  return 'F';
}
function badgeOf(g: string) {
  if (g === 'A+' || g === 'A') return 'badge-green';
  if (g === 'B' || g === 'C') return 'badge-blue';
  if (g === 'D') return 'badge-yellow';
  return 'badge-red';
}

const INITIAL: Result[] = [
  { id:1,  studentId:1001, name:'Alice Johnson', course:'Data Structures', code:'CS302', marks:88, total:100, grade:'A',  term:'Spring 2026' },
  { id:2,  studentId:1001, name:'Alice Johnson', course:'Linear Algebra',  code:'MTH201',marks:92, total:100, grade:'A+', term:'Spring 2026' },
  { id:3,  studentId:1002, name:'Ben Patel',     course:'Principles of Management', code:'BUS201', marks:76, total:100, grade:'B', term:'Spring 2026' },
  { id:4,  studentId:1003, name:'Carla Gomez',   course:'General Biology', code:'BIO150', marks:65, total:100, grade:'C', term:'Spring 2026' },
  { id:5,  studentId:1004, name:'Daniel Kim',    course:'Thermodynamics',  code:'ME201',  marks:55, total:100, grade:'D', term:'Spring 2026' },
  { id:6,  studentId:1005, name:'Eva Singh',     course:'Linear Algebra',  code:'MTH201', marks:94, total:100, grade:'A+',term:'Spring 2026' },
  { id:7,  studentId:1006, name:'Frank Lee',     course:'Intro to CS',     code:'CS101',  marks:42, total:100, grade:'F', term:'Spring 2026' },
  { id:8,  studentId:1007, name:'Grace Wu',      course:'Organic Chemistry',code:'CHM101',marks:81, total:100, grade:'A', term:'Spring 2026' },
];

const blank: Omit<Result,'id'|'grade'> = { studentId:0, name:'', course:'', code:'', marks:0, total:100, term:'Spring 2026' };

export default function Results() {
  const [list, setList] = useState<Result[]>(INITIAL);
  const [q, setQ] = useState('');
  const [show, setShow] = useState(false);
  const [form, setForm] = useState<any>({ ...blank });
  const [editing, setEditing] = useState(false);

  const filtered = list.filter(r =>
    r.name.toLowerCase().includes(q.toLowerCase()) ||
    r.code.toLowerCase().includes(q.toLowerCase()) ||
    r.course.toLowerCase().includes(q.toLowerCase())
  );

  const ch = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
    setForm((f: any) => ({ ...f, [e.target.name]: e.target.type === 'number' ? +e.target.value : e.target.value }));

  function openAdd() { setForm({ ...blank, id: Date.now() }); setEditing(false); setShow(true); }
  function openEdit(r: Result) { setForm(r); setEditing(true); setShow(true); }
  function del(id: number) { if (confirm('Delete result?')) setList(p => p.filter(r => r.id !== id)); }
  function save(e: React.FormEvent) {
    e.preventDefault();
    if (!form.name.trim()) return alert('Student name required');
    const pct = (form.marks / form.total) * 100;
    const entry = { ...form, grade: gradeOf(pct) };
    if (editing) setList(p => p.map(r => r.id === entry.id ? entry : r));
    else setList(p => [entry, ...p]);
    setShow(false);
  }

  const pass = filtered.filter(r => r.grade !== 'F').length;
  const avg  = filtered.length ? Math.round(filtered.reduce((s, r) => s + (r.marks / r.total) * 100, 0) / filtered.length) : 0;

  return (
    <section className="container">
      <header className="page-header">
        <div><h1>Results</h1><p className="muted">Student examination results and grades.</p></div>
        <div className="toolbar">
          <input className="search" value={q} onChange={e => setQ(e.target.value)} placeholder="Search student or course…" />
          <button className="btn-gold" onClick={openAdd}>+ Add Result</button>
        </div>
      </header>

      <div className="grid-3" style={{ marginBottom: 18 }}>
        <div className="stat-card"><div className="stat-icon">📊</div><div><div className="stat-value">{filtered.length}</div><div className="stat-label">Total Results</div></div></div>
        <div className="stat-card"><div className="stat-icon">✅</div><div><div className="stat-value">{filtered.length ? Math.round((pass / filtered.length) * 100) : 0}%</div><div className="stat-label">Pass Rate</div></div></div>
        <div className="stat-card"><div className="stat-icon">📈</div><div><div className="stat-value">{avg}%</div><div className="stat-label">Average Score</div></div></div>
      </div>

      <div className="table-card">
        <table className="uni-table">
          <thead><tr><th>Student</th><th>ID</th><th>Course</th><th>Code</th><th>Marks</th><th>Percentage</th><th>Grade</th><th>Term</th><th>Actions</th></tr></thead>
          <tbody>
            {filtered.length === 0
              ? <tr className="empty-row"><td colSpan={9}>No results found</td></tr>
              : filtered.map(r => {
                const pct = Math.round((r.marks / r.total) * 100);
                return (
                  <tr key={r.id}>
                    <td style={{ fontWeight: 600 }}>{r.name}</td>
                    <td className="muted">{r.studentId}</td>
                    <td>{r.course}</td>
                    <td style={{ color: 'var(--gold)', fontWeight: 700 }}>{r.code}</td>
                    <td>{r.marks}/{r.total}</td>
                    <td>{pct}%</td>
                    <td><span className={`badge ${badgeOf(r.grade)}`}>{r.grade}</span></td>
                    <td className="muted">{r.term}</td>
                    <td style={{ display: 'flex', gap: 6 }}>
                      <button className="btn-muted btn-sm" onClick={() => openEdit(r)}>Edit</button>
                      <button className="btn-danger" onClick={() => del(r.id)}>Delete</button>
                    </td>
                  </tr>
                );
              })}
          </tbody>
        </table>
      </div>

      {show && (
        <div className="modal-backdrop">
          <form className="modal" onSubmit={save}>
            <h3>{editing ? 'Edit Result' : 'Add Result'}</h3>
            <label>Student Name <input name="name"      value={form.name}      onChange={ch} /></label>
            <label>Student ID   <input name="studentId" value={form.studentId} onChange={ch} type="number" /></label>
            <label>Course       <input name="course"    value={form.course}    onChange={ch} /></label>
            <label>Course Code  <input name="code"      value={form.code}      onChange={ch} /></label>
            <label>Marks Obtained <input name="marks"  value={form.marks}     onChange={ch} type="number" min={0} /></label>
            <label>Total Marks  <input name="total"     value={form.total}     onChange={ch} type="number" min={1} /></label>
            <label>Term         <input name="term"      value={form.term}      onChange={ch} /></label>
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
