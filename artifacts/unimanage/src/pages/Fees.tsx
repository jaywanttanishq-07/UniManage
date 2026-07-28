import { useState } from 'react';

interface FeeRecord { id: number; studentId: number; name: string; program: string; amount: number; paid: number; due: string; status: string; semester: string; }

const INITIAL: FeeRecord[] = [
  { id:1, studentId:1001, name:'Alice Johnson', program:'Computer Science', amount:45000, paid:45000, due:'2026-07-15', status:'Paid',    semester:'Sem 5' },
  { id:2, studentId:1002, name:'Ben Patel',     program:'Business',          amount:38000, paid:38000, due:'2026-07-15', status:'Paid',    semester:'Sem 6' },
  { id:3, studentId:1003, name:'Carla Gomez',   program:'Biology',           amount:42000, paid:20000, due:'2026-08-02', status:'Partial', semester:'Sem 2' },
  { id:4, studentId:1004, name:'Daniel Kim',    program:'Mechanical Eng.',   amount:50000, paid:0,     due:'2026-08-02', status:'Unpaid',  semester:'Sem 8' },
  { id:5, studentId:1005, name:'Eva Singh',     program:'Mathematics',       amount:36000, paid:36000, due:'2026-07-15', status:'Paid',    semester:'Sem 4' },
  { id:6, studentId:1006, name:'Frank Lee',     program:'Physics',           amount:40000, paid:40000, due:'2026-07-15', status:'Paid',    semester:'Sem 6' },
  { id:7, studentId:1007, name:'Grace Wu',      program:'Chemistry',         amount:44000, paid:0,     due:'2026-08-02', status:'Unpaid',  semester:'Sem 2' },
  { id:8, studentId:1008, name:'Henry Brown',   program:'Computer Science',  amount:45000, paid:22000, due:'2026-08-02', status:'Partial', semester:'Sem 7' },
];

function statusBadge(s: string) {
  if (s === 'Paid') return 'badge-green';
  if (s === 'Partial') return 'badge-yellow';
  return 'badge-red';
}

const blank: FeeRecord = { id:0, studentId:0, name:'', program:'', amount:0, paid:0, due:'', status:'Unpaid', semester:'' };

export default function Fees() {
  const [list, setList] = useState<FeeRecord[]>(INITIAL);
  const [q, setQ] = useState('');
  const [filter, setFilter] = useState('All');
  const [show, setShow] = useState(false);
  const [form, setForm] = useState<FeeRecord>(blank);
  const [editing, setEditing] = useState(false);

  const filtered = list
    .filter(f => filter === 'All' || f.status === filter)
    .filter(f => f.name.toLowerCase().includes(q.toLowerCase()) || String(f.studentId).includes(q));

  const totalCollected = list.reduce((s, r) => s + r.paid, 0);
  const totalDue       = list.reduce((s, r) => s + (r.amount - r.paid), 0);

  const ch = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
    setForm(f => ({ ...f, [e.target.name]: e.target.type === 'number' ? +e.target.value : e.target.value }));

  function computeStatus(f: FeeRecord) {
    if (f.paid >= f.amount) return 'Paid';
    if (f.paid > 0) return 'Partial';
    return 'Unpaid';
  }
  function openAdd() { setForm({ ...blank, id: Date.now() }); setEditing(false); setShow(true); }
  function openEdit(r: FeeRecord) { setForm(r); setEditing(true); setShow(true); }
  function del(id: number) { if (confirm('Delete record?')) setList(p => p.filter(f => f.id !== id)); }
  function save(e: React.FormEvent) {
    e.preventDefault();
    if (!form.name.trim()) return alert('Name required');
    const entry = { ...form, status: computeStatus(form) };
    if (editing) setList(p => p.map(f => f.id === entry.id ? entry : f));
    else setList(p => [entry, ...p]);
    setShow(false);
  }

  return (
    <section className="container">
      <header className="page-header">
        <div><h1>Fees</h1><p className="muted">Track student fee collection and dues.</p></div>
        <div className="toolbar">
          <input className="search" value={q} onChange={e => setQ(e.target.value)} placeholder="Search student or ID…" />
          {(['All','Paid','Partial','Unpaid'] as const).map(t => (
            <button key={t} className={filter === t ? 'btn-gold btn-sm' : 'btn-muted btn-sm'} onClick={() => setFilter(t)}>{t}</button>
          ))}
          <button className="btn-gold" onClick={openAdd}>+ Add Record</button>
        </div>
      </header>

      <div className="grid-3" style={{ marginBottom: 18 }}>
        <div className="stat-card"><div className="stat-icon">✅</div><div><div className="stat-value">₹{(totalCollected/1000).toFixed(0)}K</div><div className="stat-label">Collected</div></div></div>
        <div className="stat-card"><div className="stat-icon">⚠️</div><div><div className="stat-value">₹{(totalDue/1000).toFixed(0)}K</div><div className="stat-label">Outstanding</div></div></div>
        <div className="stat-card"><div className="stat-icon">👥</div><div><div className="stat-value">{list.filter(f => f.status !== 'Paid').length}</div><div className="stat-label">Pending Students</div></div></div>
      </div>

      <div className="table-card">
        <table className="uni-table">
          <thead><tr><th>Student</th><th>ID</th><th>Program</th><th>Semester</th><th>Amount</th><th>Paid</th><th>Balance</th><th>Due Date</th><th>Status</th><th>Actions</th></tr></thead>
          <tbody>
            {filtered.length === 0
              ? <tr className="empty-row"><td colSpan={10}>No records found</td></tr>
              : filtered.map(f => (
                <tr key={f.id}>
                  <td style={{ fontWeight: 600 }}>{f.name}</td>
                  <td className="muted">{f.studentId}</td>
                  <td>{f.program}</td>
                  <td>{f.semester}</td>
                  <td>₹{f.amount.toLocaleString()}</td>
                  <td style={{ color: '#4ecb71' }}>₹{f.paid.toLocaleString()}</td>
                  <td style={{ color: f.amount - f.paid > 0 ? '#e05050' : '#4ecb71' }}>₹{(f.amount - f.paid).toLocaleString()}</td>
                  <td className="muted">{f.due}</td>
                  <td><span className={`badge ${statusBadge(f.status)}`}>{f.status}</span></td>
                  <td style={{ display: 'flex', gap: 6 }}>
                    <button className="btn-muted btn-sm" onClick={() => openEdit(f)}>Edit</button>
                    <button className="btn-danger" onClick={() => del(f.id)}>Delete</button>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>

      {show && (
        <div className="modal-backdrop">
          <form className="modal" onSubmit={save}>
            <h3>{editing ? 'Edit Fee Record' : 'Add Fee Record'}</h3>
            <label>Student Name <input name="name"      value={form.name}      onChange={ch} /></label>
            <label>Student ID   <input name="studentId" value={form.studentId} onChange={ch} type="number" /></label>
            <label>Program      <input name="program"   value={form.program}   onChange={ch} /></label>
            <label>Semester     <input name="semester"  value={form.semester}  onChange={ch} placeholder="Sem 5" /></label>
            <label>Total Amount <input name="amount"    value={form.amount}    onChange={ch} type="number" min={0} /></label>
            <label>Amount Paid  <input name="paid"      value={form.paid}      onChange={ch} type="number" min={0} /></label>
            <label>Due Date     <input name="due"       value={form.due}       onChange={ch} type="date" /></label>
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
