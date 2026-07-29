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
function gpaOf(g: string) {
  return { 'A+': 4.0, 'A': 4.0, 'B': 3.0, 'C': 2.0, 'D': 1.0, 'F': 0.0 }[g] ?? 0;
}

const INITIAL: Result[] = [
  { id:1,  studentId:1001, name:'Alice Johnson', course:'Data Structures',       code:'CS302',  marks:88, total:100, grade:'A',  term:'Spring 2026' },
  { id:2,  studentId:1001, name:'Alice Johnson', course:'Linear Algebra',        code:'MTH201', marks:92, total:100, grade:'A+', term:'Spring 2026' },
  { id:3,  studentId:1001, name:'Alice Johnson', course:'Database Systems',      code:'CS410',  marks:79, total:100, grade:'B',  term:'Spring 2026' },
  { id:4,  studentId:1002, name:'Ben Patel',     course:'Principles of Mgmt.',  code:'BUS201', marks:76, total:100, grade:'B',  term:'Spring 2026' },
  { id:5,  studentId:1002, name:'Ben Patel',     course:'Financial Accounting', code:'BUS420', marks:68, total:100, grade:'C',  term:'Spring 2026' },
  { id:6,  studentId:1003, name:'Carla Gomez',   course:'General Biology',      code:'BIO150', marks:65, total:100, grade:'C',  term:'Spring 2026' },
  { id:7,  studentId:1003, name:'Carla Gomez',   course:'Microbiology',         code:'BIO230', marks:72, total:100, grade:'B',  term:'Spring 2026' },
  { id:8,  studentId:1004, name:'Daniel Kim',    course:'Thermodynamics',       code:'ME201',  marks:55, total:100, grade:'D',  term:'Spring 2026' },
  { id:9,  studentId:1004, name:'Daniel Kim',    course:'Fluid Mechanics',      code:'ME310',  marks:61, total:100, grade:'C',  term:'Spring 2026' },
  { id:10, studentId:1005, name:'Eva Singh',     course:'Linear Algebra',       code:'MTH201', marks:94, total:100, grade:'A+', term:'Spring 2026' },
  { id:11, studentId:1006, name:'Frank Lee',     course:'Intro to CS',          code:'CS101',  marks:42, total:100, grade:'F',  term:'Spring 2026' },
  { id:12, studentId:1007, name:'Grace Wu',      course:'Organic Chemistry',    code:'CHM101', marks:81, total:100, grade:'A',  term:'Spring 2026' },
  { id:13, studentId:1007, name:'Grace Wu',      course:'Physical Chemistry',   code:'CHM202', marks:75, total:100, grade:'B',  term:'Spring 2026' },
];

const blank: Omit<Result,'id'|'grade'> = { studentId:0, name:'', course:'', code:'', marks:0, total:100, term:'Spring 2026' };

export default function Results() {
  const [list, setList]     = useState<Result[]>(INITIAL);
  const [tab, setTab]       = useState<'faculty'|'admin'>('faculty');

  // Faculty checker state
  const [fcQuery, setFcQuery] = useState('');
  const [fcSelected, setFcSelected] = useState<number | null>(null);

  // Admin state
  const [q, setQ]           = useState('');
  const [show, setShow]     = useState(false);
  const [form, setForm]     = useState<any>({ ...blank });
  const [editing, setEditing] = useState(false);

  const ch = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
    setForm((f: any) => ({ ...f, [e.target.name]: e.target.type === 'number' ? +e.target.value : e.target.value }));

  function openAdd()         { setForm({ ...blank, id: Date.now() }); setEditing(false); setShow(true); }
  function openEdit(r: Result) { setForm(r); setEditing(true); setShow(true); }
  function del(id: number)   { if (confirm('Delete result?')) setList(p => p.filter(r => r.id !== id)); }
  function save(e: React.FormEvent) {
    e.preventDefault();
    if (!form.name.trim()) return alert('Student name required');
    const pct  = (form.marks / form.total) * 100;
    const entry = { ...form, grade: gradeOf(pct) };
    if (editing) setList(p => p.map(r => r.id === entry.id ? entry : r));
    else setList(p => [entry, ...p]);
    setShow(false);
  }

  // ── Faculty checker helpers ─────────────────────────────────────────────
  const uniqueStudents = Array.from(
    new Map(list.map(r => [r.studentId, { id: r.studentId, name: r.name }])).values()
  );
  const fcMatches = fcQuery.trim()
    ? uniqueStudents.filter(s =>
        s.name.toLowerCase().includes(fcQuery.toLowerCase()) ||
        String(s.id).includes(fcQuery)
      )
    : [];
  const selectedStudent = fcSelected !== null ? uniqueStudents.find(s => s.id === fcSelected) : null;
  const studentResults  = fcSelected !== null ? list.filter(r => r.studentId === fcSelected) : [];
  const sgpa = studentResults.length
    ? (studentResults.reduce((s, r) => s + gpaOf(r.grade), 0) / studentResults.length).toFixed(2)
    : '—';
  const passCount = studentResults.filter(r => r.grade !== 'F').length;
  const avgPct = studentResults.length
    ? Math.round(studentResults.reduce((s, r) => s + (r.marks / r.total) * 100, 0) / studentResults.length)
    : 0;

  // ── Admin helpers ────────────────────────────────────────────────────────
  const filtered = list.filter(r =>
    r.name.toLowerCase().includes(q.toLowerCase()) ||
    r.code.toLowerCase().includes(q.toLowerCase()) ||
    r.course.toLowerCase().includes(q.toLowerCase())
  );
  const pass = filtered.filter(r => r.grade !== 'F').length;
  const avg  = filtered.length ? Math.round(filtered.reduce((s, r) => s + (r.marks / r.total) * 100, 0) / filtered.length) : 0;

  return (
    <section className="container">
      <header className="page-header">
        <div><h1>Results</h1><p className="muted">Student examination results and grades.</p></div>
        {tab === 'admin' && <button className="btn-gold" onClick={openAdd}>+ Add Result</button>}
      </header>

      {/* Tab switcher */}
      <div className="tab-bar" style={{ marginBottom: 24 }}>
        <button className={`tab-btn${tab === 'faculty' ? ' active' : ''}`} onClick={() => setTab('faculty')}>
          🔍 Faculty Result Checker
        </button>
        <button className={`tab-btn${tab === 'admin' ? ' active' : ''}`} onClick={() => setTab('admin')}>
          📋 All Results (Admin)
        </button>
      </div>

      {/* ── FACULTY CHECKER TAB ─────────────────────────────────────────── */}
      {tab === 'faculty' && (
        <div>
          <div className="fc-search-box">
            <div className="fc-search-inner">
              <span className="fc-search-icon">🔍</span>
              <input
                className="fc-input"
                placeholder="Search student by name or ID…"
                value={fcQuery}
                onChange={e => { setFcQuery(e.target.value); setFcSelected(null); }}
              />
              {fcQuery && (
                <button className="fc-clear" onClick={() => { setFcQuery(''); setFcSelected(null); }}>✕</button>
              )}
            </div>

            {fcMatches.length > 0 && !selectedStudent && (
              <div className="fc-dropdown">
                {fcMatches.map(s => (
                  <div key={s.id} className="fc-dropdown-item" onClick={() => { setFcSelected(s.id); setFcQuery(s.name); }}>
                    <span className="fc-dropdown-name">{s.name}</span>
                    <span className="fc-dropdown-id">ID: {s.id}</span>
                  </div>
                ))}
              </div>
            )}

            {fcQuery && fcMatches.length === 0 && !selectedStudent && (
              <div className="fc-dropdown">
                <div className="fc-dropdown-empty">No students match "{fcQuery}"</div>
              </div>
            )}
          </div>

          {!selectedStudent && (
            <div className="fc-placeholder">
              <div className="fc-placeholder-icon">🎓</div>
              <p>Search for a student above to view their result card.</p>
              <div className="fc-all-students">
                {uniqueStudents.map(s => (
                  <button
                    key={s.id}
                    className="fc-student-chip"
                    onClick={() => { setFcSelected(s.id); setFcQuery(s.name); }}
                  >
                    {s.name} <span className="fc-chip-id">#{s.id}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {selectedStudent && (
            <div className="fc-report-card">
              {/* Report card header */}
              <div className="fc-report-header">
                <div className="fc-report-avatar">{selectedStudent.name.charAt(0)}</div>
                <div>
                  <h2 className="fc-report-name">{selectedStudent.name}</h2>
                  <p className="fc-report-id">Student ID: {selectedStudent.id}</p>
                  {studentResults[0] && <p className="fc-report-term">{studentResults[0].term}</p>}
                </div>
                <button className="btn-muted btn-sm" style={{ marginLeft: 'auto' }} onClick={() => { setFcSelected(null); setFcQuery(''); }}>
                  ✕ Clear
                </button>
              </div>

              {/* Summary stats */}
              <div className="grid-3" style={{ marginBottom: 20 }}>
                <div className="stat-card">
                  <div className="stat-icon">📊</div>
                  <div><div className="stat-value">{sgpa}</div><div className="stat-label">SGPA</div></div>
                </div>
                <div className="stat-card">
                  <div className="stat-icon">✅</div>
                  <div><div className="stat-value">{passCount}/{studentResults.length}</div><div className="stat-label">Courses Passed</div></div>
                </div>
                <div className="stat-card">
                  <div className="stat-icon">📈</div>
                  <div><div className="stat-value">{avgPct}%</div><div className="stat-label">Average Score</div></div>
                </div>
              </div>

              {/* Per-course result cards */}
              <div className="fc-course-results">
                {studentResults.map(r => {
                  const pct = Math.round((r.marks / r.total) * 100);
                  return (
                    <div key={r.id} className="fc-result-row">
                      <div className="fc-result-left">
                        <span className="fc-result-code">{r.code}</span>
                        <div>
                          <div className="fc-result-course">{r.course}</div>
                          <div className="fc-result-marks">{r.marks} / {r.total} marks</div>
                        </div>
                      </div>
                      <div className="fc-result-right">
                        <div className="fc-result-bar-wrap">
                          <div className="fc-result-bar" style={{ width: `${pct}%`, background: pct >= 70 ? 'var(--gold)' : pct >= 50 ? '#f59e0b' : '#ef4444' }} />
                        </div>
                        <span className="fc-result-pct">{pct}%</span>
                        <span className={`badge ${badgeOf(r.grade)}`}>{r.grade}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      )}

      {/* ── ADMIN TAB ───────────────────────────────────────────────────── */}
      {tab === 'admin' && (
        <>
          <div className="toolbar" style={{ marginBottom: 16 }}>
            <input className="search" value={q} onChange={e => setQ(e.target.value)} placeholder="Search student or course…" />
          </div>

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
        </>
      )}

      {show && (
        <div className="modal-backdrop">
          <form className="modal" onSubmit={save}>
            <h3>{editing ? 'Edit Result' : 'Add Result'}</h3>
            <label>Student Name  <input name="name"      value={form.name}      onChange={ch} /></label>
            <label>Student ID    <input name="studentId" value={form.studentId} onChange={ch} type="number" /></label>
            <label>Course        <input name="course"    value={form.course}    onChange={ch} /></label>
            <label>Course Code   <input name="code"      value={form.code}      onChange={ch} /></label>
            <label>Marks Obtained<input name="marks"     value={form.marks}     onChange={ch} type="number" min={0} /></label>
            <label>Total Marks   <input name="total"     value={form.total}     onChange={ch} type="number" min={1} /></label>
            <label>Term          <input name="term"      value={form.term}      onChange={ch} /></label>
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
