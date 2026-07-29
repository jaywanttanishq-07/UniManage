import { useState } from 'react';

interface Dept { id: number; name: string; head: string; faculty: number; courses: number; students: number; established: string; }

const DEPT_ICONS: Record<string, string> = {
  'Computer Science': '💻', 'Mechanical Eng.': '⚙️', 'Biology': '🧬',
  'Business': '📊', 'Mathematics': '📐', 'Chemistry': '🧪',
};

const INITIAL: Dept[] = [
  { id: 1, name: 'Computer Science', head: 'Dr. Sarah Mitchell', faculty: 18, courses: 24, students: 312, established: '1998' },
  { id: 2, name: 'Mechanical Eng.',  head: 'Prof. James Carter',  faculty: 15, courses: 20, students: 240, established: '1985' },
  { id: 3, name: 'Biology',          head: 'Prof. Nina Roberts',  faculty: 12, courses: 18, students: 198, established: '1990' },
  { id: 4, name: 'Business',         head: 'Prof. Alan Wright',   faculty: 20, courses: 28, students: 385, established: '1980' },
  { id: 5, name: 'Mathematics',      head: 'Dr. Li Wei',          faculty: 10, courses: 16, students: 145, established: '1975' },
  { id: 6, name: 'Chemistry',        head: 'Dr. Priya Sharma',    faculty: 11, courses: 14, students: 132, established: '1988' },
];

const blank: Dept = { id: 0, name: '', head: '', faculty: 0, courses: 0, students: 0, established: '' };

export default function Departments() {
  const [list, setList] = useState<Dept[]>(INITIAL);
  const [show, setShow] = useState(false);
  const [form, setForm] = useState<Dept>(blank);
  const [editing, setEditing] = useState(false);

  const ch = (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm(f => ({ ...f, [e.target.name]: e.target.type === 'number' ? +e.target.value : e.target.value }));

  function openAdd() { setForm({ ...blank, id: Date.now() }); setEditing(false); setShow(true); }
  function openEdit(d: Dept) { setForm(d); setEditing(true); setShow(true); }
  function del(id: number) { if (confirm('Delete department?')) setList(p => p.filter(d => d.id !== id)); }
  function save(e: React.FormEvent) {
    e.preventDefault();
    if (!form.name.trim()) return alert('Name required');
    if (editing) setList(p => p.map(d => d.id === form.id ? form : d));
    else setList(p => [...p, form]);
    setShow(false);
  }

  const totalStudents = list.reduce((s, d) => s + d.students, 0);
  const totalFaculty  = list.reduce((s, d) => s + d.faculty, 0);
  const totalCourses  = list.reduce((s, d) => s + d.courses, 0);

  return (
    <section className="container">
      <header className="page-header">
        <div><h1>Departments</h1><p className="muted">Manage university departments and faculty allocation.</p></div>
        <button className="btn-gold" onClick={openAdd}>+ Add Department</button>
      </header>

      <div className="grid-3" style={{ marginBottom: 24 }}>
        <div className="stat-card"><div className="stat-icon">🏛️</div><div><div className="stat-value">{list.length}</div><div className="stat-label">Departments</div></div></div>
        <div className="stat-card"><div className="stat-icon">👨‍🏫</div><div><div className="stat-value">{totalFaculty}</div><div className="stat-label">Total Faculty</div></div></div>
        <div className="stat-card"><div className="stat-icon">📚</div><div><div className="stat-value">{totalCourses}</div><div className="stat-label">Total Courses</div></div></div>
      </div>

      <div className="dept-grid">
        {list.map((d, i) => {
          const icon = DEPT_ICONS[d.name] ?? '🏛️';
          return (
            <div key={d.id} className="dept-card" style={{ animation: 'popIn .38s cubic-bezier(.22,.68,0,1.2) both', animationDelay: `${i * 70}ms` }}>
              <div className="dept-card-header">
                <span className="dept-icon">{icon}</span>
                <div className="dept-card-actions">
                  <button className="btn-muted btn-sm" onClick={() => openEdit(d)}>Edit</button>
                  <button className="btn-danger" onClick={() => del(d.id)}>Delete</button>
                </div>
              </div>
              <h3 className="dept-card-name">{d.name}</h3>
              <p className="dept-card-head">🎓 {d.head}</p>
              <div className="dept-card-stats">
                <div className="dept-stat">
                  <span className="dept-stat-value">{d.faculty}</span>
                  <span className="dept-stat-label">Faculty</span>
                </div>
                <div className="dept-stat-divider" />
                <div className="dept-stat">
                  <span className="dept-stat-value">{d.courses}</span>
                  <span className="dept-stat-label">Courses</span>
                </div>
                <div className="dept-stat-divider" />
                <div className="dept-stat">
                  <span className="dept-stat-value">{d.students.toLocaleString()}</span>
                  <span className="dept-stat-label">Students</span>
                </div>
              </div>
              <div className="dept-card-footer">Est. {d.established}</div>
            </div>
          );
        })}
      </div>

      {show && (
        <div className="modal-backdrop">
          <form className="modal" onSubmit={save}>
            <h3>{editing ? 'Edit Department' : 'Add Department'}</h3>
            <label>Name         <input name="name"        value={form.name}        onChange={ch} /></label>
            <label>Head         <input name="head"        value={form.head}        onChange={ch} /></label>
            <label>Faculty Count<input name="faculty"     value={form.faculty}     onChange={ch} type="number" min={0} /></label>
            <label>Courses      <input name="courses"     value={form.courses}     onChange={ch} type="number" min={0} /></label>
            <label>Students     <input name="students"    value={form.students}    onChange={ch} type="number" min={0} /></label>
            <label>Established  <input name="established" value={form.established} onChange={ch} placeholder="e.g. 1995" /></label>
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
