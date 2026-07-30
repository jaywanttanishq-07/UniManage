import { useState } from 'react';

type ScholarType = 'Merit' | 'Need-based' | 'Sports' | 'Research' | 'Cultural';
type ScholarStatus = 'Active' | 'Pending' | 'Expired';

interface Scholarship {
  id: number;
  name: string;
  student: string;
  studentId: number;
  program: string;
  type: ScholarType;
  amount: number;
  status: ScholarStatus;
  awarded: string;
  expiry: string;
}

const TYPE_ICON: Record<ScholarType, string> = {
  Merit: '🏅', 'Need-based': '🤝', Sports: '⚽', Research: '🔬', Cultural: '🎭',
};
const STATUS_BADGE: Record<ScholarStatus, string> = {
  Active: 'badge-green', Pending: 'badge-yellow', Expired: 'badge-gray',
};

const INITIAL: Scholarship[] = [
  { id:1,  name:'Chancellor Merit Award',       student:'Alice Johnson', studentId:1001, program:'Computer Science', type:'Merit',      amount:75000,  status:'Active',  awarded:'2026-01-15', expiry:'2026-12-31' },
  { id:2,  name:'Financial Aid Grant',           student:'Ben Patel',     studentId:1002, program:'Business',         type:'Need-based', amount:50000,  status:'Active',  awarded:'2026-02-01', expiry:'2026-12-31' },
  { id:3,  name:'National Science Fellowship',   student:'Carla Gomez',   studentId:1003, program:'Biology',          type:'Research',   amount:120000, status:'Active',  awarded:'2026-03-10', expiry:'2027-03-09' },
  { id:4,  name:'Sports Excellence Award',       student:'Daniel Kim',    studentId:1004, program:'Mechanical Eng.',  type:'Sports',     amount:40000,  status:'Pending', awarded:'2026-07-01', expiry:'2026-12-31' },
  { id:5,  name:'Academic Distinction Prize',    student:'Eva Singh',     studentId:1005, program:'Mathematics',      type:'Merit',      amount:60000,  status:'Active',  awarded:'2025-09-01', expiry:'2026-08-31' },
  { id:6,  name:'Cultural Heritage Scholarship', student:'Grace Wu',      studentId:1007, program:'Chemistry',        type:'Cultural',   amount:35000,  status:'Active',  awarded:'2026-04-15', expiry:'2026-12-31' },
  { id:7,  name:'STEM Research Grant',           student:'Frank Lee',     studentId:1006, program:'Physics',          type:'Research',   amount:90000,  status:'Pending', awarded:'2026-06-20', expiry:'2027-06-19' },
  { id:8,  name:'Need-based Support Fund',       student:'Henry Brown',   studentId:1008, program:'Computer Science', type:'Need-based', amount:45000,  status:'Expired', awarded:'2025-01-01', expiry:'2025-12-31' },
];

const BLANK: Omit<Scholarship,'id'> = {
  name:'', student:'', studentId:0, program:'', type:'Merit', amount:0, status:'Active', awarded:'', expiry:'',
};

const TYPES:  ScholarType[]   = ['Merit','Need-based','Sports','Research','Cultural'];
const STATUSES: ScholarStatus[] = ['Active','Pending','Expired'];
const PROGRAMS = ['Computer Science','Business','Biology','Mechanical Eng.','Mathematics','Chemistry','Physics'];

export default function Scholarship() {
  const [list, setList]   = useState<Scholarship[]>(INITIAL);
  const [q, setQ]         = useState('');
  const [typeF, setTypeF] = useState<string>('All');
  const [statF, setStatF] = useState<string>('All');
  const [show, setShow]   = useState(false);
  const [form, setForm]   = useState<Omit<Scholarship,'id'>>(BLANK);
  const [editing, setEditing] = useState<number | null>(null);

  const ch = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
    setForm(f => ({ ...f, [e.target.name]: e.target.type === 'number' ? +e.target.value : e.target.value }));

  function openAdd()  { setForm({ ...BLANK }); setEditing(null); setShow(true); }
  function openEdit(s: Scholarship) { setForm({ ...s }); setEditing(s.id); setShow(true); }
  function del(id: number) { if (confirm('Delete scholarship?')) setList(p => p.filter(s => s.id !== id)); }
  function save(e: React.FormEvent) {
    e.preventDefault();
    if (!form.name.trim() || !form.student.trim()) return alert('Name and student required');
    if (editing !== null) {
      setList(p => p.map(s => s.id === editing ? { ...form, id: editing } : s));
    } else {
      setList(p => [...p, { ...form, id: Date.now() }]);
    }
    setShow(false);
  }

  const filtered = list.filter(s =>
    (typeF === 'All' || s.type === typeF) &&
    (statF === 'All' || s.status === statF) &&
    (s.name.toLowerCase().includes(q.toLowerCase()) ||
     s.student.toLowerCase().includes(q.toLowerCase()) ||
     s.program.toLowerCase().includes(q.toLowerCase()))
  );

  const totalAmount  = filtered.reduce((s, x) => s + x.amount, 0);
  const activeCount  = filtered.filter(x => x.status === 'Active').length;
  const pendingCount = filtered.filter(x => x.status === 'Pending').length;

  return (
    <section className="container">
      <header className="page-header">
        <div><h1>Scholarships</h1><p className="muted">Manage student scholarships and financial awards.</p></div>
        <div className="toolbar">
          <input className="search" value={q} onChange={e => setQ(e.target.value)} placeholder="Search name, student, program…" />
          <button className="btn-gold" onClick={openAdd}>+ Add Scholarship</button>
        </div>
      </header>

      {/* Stats */}
      <div className="grid-4" style={{ marginBottom: 22 }}>
        <div className="stat-card"><div className="stat-icon">🏆</div><div><div className="stat-value">{filtered.length}</div><div className="stat-label">Total Scholarships</div></div></div>
        <div className="stat-card"><div className="stat-icon">✅</div><div><div className="stat-value">{activeCount}</div><div className="stat-label">Active</div></div></div>
        <div className="stat-card"><div className="stat-icon">⏳</div><div><div className="stat-value">{pendingCount}</div><div className="stat-label">Pending Approval</div></div></div>
        <div className="stat-card"><div className="stat-icon">💰</div><div><div className="stat-value">₹{(totalAmount/1000).toFixed(0)}K</div><div className="stat-label">Total Awarded</div></div></div>
      </div>

      {/* Filter pills */}
      <div style={{ display:'flex', gap:18, flexWrap:'wrap', marginBottom:20 }}>
        <div className="filter-pills">
          {['All',...TYPES].map(t => (
            <button key={t} className={`filter-pill${typeF===t?' active':''}`} onClick={() => setTypeF(t)}>
              {t !== 'All' ? `${TYPE_ICON[t as ScholarType]} ` : ''}{t}
            </button>
          ))}
        </div>
        <div className="filter-pills">
          {['All',...STATUSES].map(s => (
            <button key={s} className={`filter-pill${statF===s?' active':''}`} onClick={() => setStatF(s)}>{s}</button>
          ))}
        </div>
      </div>

      {/* Cards grid */}
      {filtered.length === 0 ? (
        <div className="table-card" style={{ padding:32, textAlign:'center', color:'var(--muted)' }}>No scholarships found</div>
      ) : (
        <div className="scholar-grid">
          {filtered.map((s, i) => (
            <div key={s.id} className="scholar-card" style={{ animationDelay:`${i*55}ms` }}>
              <div className="scholar-card-top">
                <span className="scholar-type-icon">{TYPE_ICON[s.type]}</span>
                <span className={`badge ${STATUS_BADGE[s.status]}`}>{s.status}</span>
              </div>
              <h3 className="scholar-name">{s.name}</h3>
              <div className="scholar-amount">₹{s.amount.toLocaleString()}</div>
              <div className="scholar-info">
                <div className="scholar-info-row"><span className="scholar-info-label">Student</span><span className="scholar-info-val">{s.student}</span></div>
                <div className="scholar-info-row"><span className="scholar-info-label">ID</span><span className="scholar-info-val muted">{s.studentId}</span></div>
                <div className="scholar-info-row"><span className="scholar-info-label">Program</span><span className="scholar-info-val">{s.program}</span></div>
                <div className="scholar-info-row"><span className="scholar-info-label">Type</span><span className="scholar-info-val">{s.type}</span></div>
                <div className="scholar-info-row"><span className="scholar-info-label">Awarded</span><span className="scholar-info-val muted">{s.awarded}</span></div>
                <div className="scholar-info-row"><span className="scholar-info-label">Expiry</span><span className="scholar-info-val muted">{s.expiry}</span></div>
              </div>
              <div className="scholar-card-actions">
                <button className="btn-muted btn-sm" onClick={() => openEdit(s)}>Edit</button>
                <button className="btn-danger" onClick={() => del(s.id)}>Delete</button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal */}
      {show && (
        <div className="modal-backdrop">
          <form className="modal" onSubmit={save} style={{ maxHeight:'80vh', overflowY:'auto' }}>
            <h3>{editing !== null ? 'Edit Scholarship' : 'Add Scholarship'}</h3>
            <label>Scholarship Name <input name="name"      value={form.name}      onChange={ch} placeholder="e.g. Merit Excellence Award" /></label>
            <label>Student Name     <input name="student"   value={form.student}   onChange={ch} /></label>
            <label>Student ID       <input name="studentId" value={form.studentId} onChange={ch} type="number" min={0} /></label>
            <label>Program
              <select name="program" value={form.program} onChange={ch}>
                <option value="">Select program</option>
                {PROGRAMS.map(p => <option key={p}>{p}</option>)}
              </select>
            </label>
            <label>Type
              <select name="type" value={form.type} onChange={ch}>
                {TYPES.map(t => <option key={t}>{t}</option>)}
              </select>
            </label>
            <label>Amount (₹) <input name="amount" value={form.amount} onChange={ch} type="number" min={0} placeholder="e.g. 50000" /></label>
            <label>Status
              <select name="status" value={form.status} onChange={ch}>
                {STATUSES.map(s => <option key={s}>{s}</option>)}
              </select>
            </label>
            <label>Awarded Date <input name="awarded" value={form.awarded} onChange={ch} type="date" /></label>
            <label>Expiry Date  <input name="expiry"  value={form.expiry}  onChange={ch} type="date" /></label>
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
