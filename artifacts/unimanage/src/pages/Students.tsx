import { useState } from 'react';
import studentsData from '../data/students.json';
import StudentFormModal from '../components/StudentFormModal';

interface Student {
  id: number;
  name: string;
  email: string;
  program: string;
}

export default function Students() {
  const [students, setStudents] = useState<Student[]>(studentsData);
  const [q, setQ] = useState('');
  const [show, setShow] = useState(false);

  const filtered = students.filter(s =>
    s.name.toLowerCase().includes(q.toLowerCase()) ||
    String(s.id).includes(q)
  );

  function addStudent(newS: Student) {
    setStudents(prev => [newS, ...prev]);
    setShow(false);
  }

  return (
    <section>
      <header className="page-header">
        <div>
          <h1>Students</h1>
          <p className="muted">Manage student records, search, and add new students.</p>
        </div>
        <div className="actions">
          <input
            className="search"
            value={q}
            onChange={e => setQ(e.target.value)}
            placeholder="Search name or ID"
          />
          <button className="btn-gold" onClick={() => setShow(true)}>+ Add Student</button>
        </div>
      </header>

      <div className="table-card">
        <table className="students-table" role="table">
          <thead>
            <tr><th>ID</th><th>Name</th><th>Email</th><th>Program</th></tr>
          </thead>
          <tbody>
            {filtered.map(s => (
              <tr key={s.id}>
                <td>{s.id}</td>
                <td>{s.name}</td>
                <td>{s.email}</td>
                <td>{s.program}</td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr><td colSpan={4} className="muted">No students found</td></tr>
            )}
          </tbody>
        </table>
      </div>

      {show && <StudentFormModal onClose={() => setShow(false)} onSave={addStudent} />}
    </section>
  );
}
