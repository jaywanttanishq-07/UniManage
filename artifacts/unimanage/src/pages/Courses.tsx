import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';

interface Course { id: string; name: string; dept: string; credits: number; instructor: string; students: number; status: string; }

const DEPT_ICONS: Record<string, string> = {
  'Computer Science': '💻', 'Mechanical Eng.': '⚙️', 'Biology': '🧬',
  'Business': '📊', 'Mathematics': '📐', 'Chemistry': '🧪',
};

const INITIAL: Course[] = [
  { id: 'CS101',  name: 'Introduction to Computer Science', dept: 'Computer Science', credits: 4, instructor: 'Dr. Sarah Mitchell', students: 68, status: 'Active' },
  { id: 'CS302',  name: 'Data Structures & Algorithms',     dept: 'Computer Science', credits: 4, instructor: 'Dr. Sarah Mitchell', students: 52, status: 'Active' },
  { id: 'CS410',  name: 'Database Systems',                 dept: 'Computer Science', credits: 3, instructor: 'Dr. Alan Park',       students: 44, status: 'Active' },
  { id: 'ME201',  name: 'Thermodynamics',                   dept: 'Mechanical Eng.',  credits: 3, instructor: 'Prof. James Carter',  students: 45, status: 'Active' },
  { id: 'ME310',  name: 'Fluid Mechanics',                  dept: 'Mechanical Eng.',  credits: 3, instructor: 'Prof. James Carter',  students: 38, status: 'Active' },
  { id: 'BIO150', name: 'General Biology',                  dept: 'Biology',          credits: 3, instructor: 'Prof. Nina Roberts',  students: 71, status: 'Active' },
  { id: 'BIO230', name: 'Microbiology',                     dept: 'Biology',          credits: 3, instructor: 'Prof. Nina Roberts',  students: 49, status: 'Active' },
  { id: 'BUS201', name: 'Principles of Management',         dept: 'Business',         credits: 3, instructor: 'Prof. Alan Wright',   students: 88, status: 'Active' },
  { id: 'BUS310', name: 'Marketing Fundamentals',           dept: 'Business',         credits: 3, instructor: 'Prof. Alan Wright',   students: 76, status: 'Active' },
  { id: 'BUS420', name: 'Financial Accounting',             dept: 'Business',         credits: 4, instructor: 'Dr. Ravi Mehta',      students: 65, status: 'Active' },
  { id: 'MTH201', name: 'Linear Algebra',                   dept: 'Mathematics',      credits: 4, instructor: 'Dr. Li Wei',          students: 39, status: 'Inactive' },
  { id: 'MTH301', name: 'Calculus III',                     dept: 'Mathematics',      credits: 4, instructor: 'Dr. Li Wei',          students: 35, status: 'Active' },
  { id: 'CHM101', name: 'Organic Chemistry',                dept: 'Chemistry',        credits: 4, instructor: 'Dr. Priya Sharma',    students: 33, status: 'Active' },
  { id: 'CHM202', name: 'Physical Chemistry',               dept: 'Chemistry',        credits: 3, instructor: 'Dr. Priya Sharma',    students: 28, status: 'Active' },
];

const blank: Course = { id: '', name: '', dept: '', credits: 3, instructor: '', students: 0, status: 'Active' };
const DEPTS = ['Computer Science', 'Mechanical Eng.', 'Biology', 'Business', 'Mathematics', 'Chemistry'];

export default function Courses() {
  const { role } = useAuth();
  const canManage = role === 'admin' || role === 'teacher';
  const [list, setList]     = useState<Course[]>(INITIAL);
  const [q, setQ]           = useState('');
  const [deptFilter, setDeptFilter] = useState('All');
  const [show, setShow]     = useState(false);
  const [form, setForm]     = useState<Course>(blank);
  const [editing, setEditing] = useState(false);

  const ch = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
    setForm(f => ({ ...f, [e.target.name]: e.target.type === 'number' ? +e.target.value : e.target.value }));

  function openAdd()         { setForm({ ...blank }); setEditing(false); setShow(true); }
  function openEdit(c: Course) { setForm(c); setEditing(true); setShow(true); }
  function del(id: string)   { if (confirm('Delete course?')) setList(p => p.filter(c => c.id !== id)); }
  function save(e: React.FormEvent) {
    e.preventDefault();
    if (!form.id.trim() || !form.name.trim()) return alert('Code and name required');
    if (editing) setList(p => p.map(c => c.id === form.id ? form : c));
    else setList(p => [...p, form]);
    setShow(false);
  }

  const searched = list.filter(c =>
    (deptFilter === 'All' || c.dept === deptFilter) &&
    (c.name.toLowerCase().includes(q.toLowerCase()) ||
     c.id.toLowerCase().includes(q.toLowerCase()) ||
     c.dept.toLowerCase().includes(q.toLowerCase()))
  );

  // group by department
  const grouped: Record<string, Course[]> = {};
  for (const c of searched) {
    if (!grouped[c.dept]) grouped[c.dept] = [];
    grouped[c.dept].push(c);
  }

  return (
    <section className="container">
      <header className="page-header">
        <div><h1>Courses</h1><p className="muted">Manage course catalogue grouped by department.</p></div>
        <div className="toolbar">
          <input className="search" value={q} onChange={e => setQ(e.target.value)} placeholder="Search name, code…" />
          {canManage && <button className="btn-gold" onClick={openAdd}>+ Add Course</button>}
        </div>
      </header>

      {/* dept filter pills */}
      <div className="filter-pills" style={{ marginBottom: 24 }}>
        {['All', ...DEPTS].map(d => (
          <button
            key={d}
            className={`filter-pill${deptFilter === d ? ' active' : ''}`}
            onClick={() => setDeptFilter(d)}
          >
            {d !== 'All' && DEPT_ICONS[d] ? `${DEPT_ICONS[d]} ` : ''}{d}
          </button>
        ))}
      </div>

      {Object.keys(grouped).length === 0 && (
        <div className="table-card" style={{ padding: 32, textAlign: 'center', color: 'var(--muted)' }}>No courses found</div>
      )}

      {Object.entries(grouped).map(([dept, courses]) => (
        <div key={dept} style={{ marginBottom: 32 }}>
          <div className="course-group-header">
            <span className="course-group-icon">{DEPT_ICONS[dept] ?? '📚'}</span>
            <h2 className="course-group-title">{dept}</h2>
            <span className="course-group-count">{courses.length} course{courses.length !== 1 ? 's' : ''}</span>
          </div>

          <div className="course-grid">
            {courses.map((c, ci) => (
              <div key={c.id} className="course-card" style={{ animation: 'popIn .36s cubic-bezier(.22,.68,0,1.2) both', animationDelay: `${ci * 60}ms` }}>
                <div className="course-card-top">
                  <span className="course-code">{c.id}</span>
                  <span className={`badge ${c.status === 'Active' ? 'badge-green' : 'badge-gray'}`}>{c.status}</span>
                </div>
                <h4 className="course-card-name">{c.name}</h4>
                <p className="course-card-instructor">👤 {c.instructor}</p>
                <div className="course-card-meta">
                  <span>⭐ {c.credits} credits</span>
                  <span>👥 {c.students} students</span>
                </div>
                {canManage && (
                  <div className="course-card-actions">
                    <button className="btn-muted btn-sm" onClick={() => openEdit(c)}>Edit</button>
                    <button className="btn-danger" onClick={() => del(c.id)}>Delete</button>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      ))}

      {canManage && show && (
        <div className="modal-backdrop">
          <form className="modal" onSubmit={save}>
            <h3>{editing ? 'Edit Course' : 'Add Course'}</h3>
            <label>Course Code
              <input name="id" value={form.id} onChange={ch} disabled={editing} placeholder="e.g. CS101" />
            </label>
            <label>Course Name <input name="name" value={form.name} onChange={ch} /></label>
            <label>Department
              <select name="dept" value={form.dept} onChange={ch}>
                <option value="">Select department</option>
                {DEPTS.map(d => <option key={d} value={d}>{d}</option>)}
              </select>
            </label>
            <label>Credits <input name="credits" value={form.credits} onChange={ch} type="number" min={1} max={6} /></label>
            <label>Instructor <input name="instructor" value={form.instructor} onChange={ch} /></label>
            <label>Status
              <select name="status" value={form.status} onChange={ch}>
                {['Active', 'Inactive'].map(s => <option key={s}>{s}</option>)}
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
