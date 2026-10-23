import { useState } from 'react';
import StudentFormModal from '../components/StudentFormModal';
import { STUDENT_ATT, attPct, attBadge } from '../data/attendance';
import { useAuth } from '../contexts/AuthContext';

export interface Student {
  id: number; name: string; email: string; program: string; year: string; status: string;
}

const INITIAL: Student[] = [
  { id: 1001, name: 'Alice Johnson', email: 'alice.j@example.edu', program: 'Computer Science', year: '2nd', status: 'Active' },
  { id: 1002, name: 'Ben Patel',     email: 'ben.p@example.edu',   program: 'Business',          year: '3rd', status: 'Active' },
  { id: 1003, name: 'Carla Gomez',   email: 'carla.g@example.edu', program: 'Biology',           year: '1st', status: 'Active' },
  { id: 1004, name: 'Daniel Kim',    email: 'dan.k@example.edu',   program: 'Mechanical Eng.',   year: '4th', status: 'Active' },
  { id: 1005, name: 'Eva Singh',     email: 'eva.s@example.edu',   program: 'Mathematics',       year: '2nd', status: 'On Leave' },
  { id: 1006, name: 'Frank Lee',     email: 'frank.l@example.edu', program: 'Physics',           year: '3rd', status: 'Active' },
  { id: 1007, name: 'Grace Wu',      email: 'grace.w@example.edu', program: 'Chemistry',         year: '1st', status: 'Active' },
  { id: 1008, name: 'Henry Brown',   email: 'henry.b@example.edu', program: 'Computer Science',  year: '4th', status: 'Inactive' },
];

export default function Students() {
  const { role } = useAuth();
  const canManage = role === 'admin' || role === 'teacher';
  const [students, setStudents] = useState<Student[]>(INITIAL);
  const [q, setQ] = useState('');
  const [show, setShow] = useState(false);
  const [editing, setEditing] = useState<Student | null>(null);

  const filtered = students.filter(s =>
    s.name.toLowerCase().includes(q.toLowerCase()) ||
    (canManage && String(s.id).includes(q)) ||
    s.program.toLowerCase().includes(q.toLowerCase())
  );

  function save(s: Student) {
    if (editing) setStudents(p => p.map(x => x.id === s.id ? s : x));
    else setStudents(p => [s, ...p]);
    setShow(false); setEditing(null);
  }
  function del(id: number) { if (confirm('Delete this student?')) setStudents(p => p.filter(s => s.id !== id)); }

  return (
    <section className="container">
      <header className="page-header">
        <div><h1>Students</h1><p className="muted">{canManage ? 'Manage student records.' : 'Student directory.'}</p></div>
        <div className="toolbar">
          <input className="search" value={q} onChange={e => setQ(e.target.value)} placeholder={canManage ? 'Search name, ID, program…' : 'Search name or program…'} />
          {canManage && <button className="btn-gold" onClick={() => { setEditing(null); setShow(true); }}>+ Add Student</button>}
        </div>
      </header>

      <div className={`table-card${canManage ? '' : ' student-directory-readonly'}`}>
        <table className="uni-table">
          <thead><tr>
            {canManage && <th>ID</th>}
            <th>Name</th>
            {canManage && <th>Email</th>}
            <th>Program</th><th>Year</th>
            {canManage && <><th>Status</th><th>Attendance</th><th>Actions</th></>}
          </tr></thead>
          <tbody>
            {filtered.length === 0
              ? <tr className="empty-row"><td colSpan={canManage ? 8 : 3}>No students found</td></tr>
              : filtered.map(s => {
                const pct = attPct(STUDENT_ATT[s.id] ?? {});
                return (
                <tr key={s.id}>
                  {canManage && <td>{s.id}</td>}
                  <td style={{ fontWeight: 600 }}>{s.name}</td>
                  {canManage && <td className="muted">{s.email}</td>}
                  <td>{s.program}</td>
                  <td>{s.year}</td>
                  {canManage && (
                    <>
                      <td><span className={`badge ${s.status === 'Active' ? 'badge-green' : s.status === 'On Leave' ? 'badge-yellow' : 'badge-gray'}`}>{s.status}</span></td>
                      <td>
                        <div className="att-inline">
                          <div className="att-inline-bar-wrap">
                            <div className="att-inline-bar" style={{ width: `${pct}%`, background: pct >= 90 ? 'var(--gold)' : pct >= 75 ? '#f59e0b' : '#ef4444' }} />
                          </div>
                          <span className={`badge ${attBadge(pct)}`}>{pct}%</span>
                        </div>
                      </td>
                      <td style={{ display: 'flex', gap: 6 }}>
                        <button className="btn-muted btn-sm" onClick={() => { setEditing(s); setShow(true); }}>Edit</button>
                        <button className="btn-danger" onClick={() => del(s.id)}>Delete</button>
                      </td>
                    </>
                  )}
                </tr>
                );
              })}
          </tbody>
        </table>
      </div>

      {show && (
        <StudentFormModal
          initial={editing ?? undefined}
          onClose={() => { setShow(false); setEditing(null); }}
          onSave={save}
        />
      )}
    </section>
  );
}
