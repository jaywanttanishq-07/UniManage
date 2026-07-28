import { useState } from 'react';

interface Route { id: number; number: string; name: string; driver: string; vehicle: string; stops: string[]; departure: string; status: string; students: number; }

const INITIAL: Route[] = [
  { id:1, number:'R-01', name:'North Campus Express', driver:'Rajan Kumar',   vehicle:'KA-01-AB-1234', stops:['Main Gate','City Centre','North Colony','Railway Station'], departure:'07:30', status:'Active',   students:28 },
  { id:2, number:'R-02', name:'South Route',          driver:'Suresh Nair',   vehicle:'KA-01-CD-5678', stops:['Main Gate','South Market','Lake View','Airport Road'],       departure:'07:45', status:'Active',   students:22 },
  { id:3, number:'R-03', name:'East Side Shuttle',    driver:'Mohan Rao',     vehicle:'KA-01-EF-9012', stops:['Main Gate','East Junction','Old Town','Bus Stand'],          departure:'08:00', status:'Active',   students:19 },
  { id:4, number:'R-04', name:'West Campus Loop',     driver:'Venkat Reddy',  vehicle:'KA-01-GH-3456', stops:['Main Gate','West Zone','Tech Park','Highway Junction'],       departure:'07:30', status:'Active',   students:31 },
  { id:5, number:'R-05', name:'City Special',         driver:'Anil Sharma',   vehicle:'KA-01-IJ-7890', stops:['Main Gate','Central Bus Stand','MG Road','City Mall'],       departure:'08:30', status:'Inactive', students:0  },
];

const blank: Route = { id:0, number:'', name:'', driver:'', vehicle:'', stops:[], departure:'07:30', status:'Active', students:0 };

export default function Transport() {
  const [list, setList] = useState<Route[]>(INITIAL);
  const [q, setQ] = useState('');
  const [show, setShow] = useState(false);
  const [form, setForm] = useState<Route>(blank);
  const [stopsInput, setStopsInput] = useState('');
  const [editing, setEditing] = useState(false);
  const [expandedId, setExpandedId] = useState<number | null>(null);

  const filtered = list.filter(r =>
    r.name.toLowerCase().includes(q.toLowerCase()) ||
    r.number.toLowerCase().includes(q.toLowerCase()) ||
    r.driver.toLowerCase().includes(q.toLowerCase())
  );

  const ch = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
    setForm(f => ({ ...f, [e.target.name]: e.target.type === 'number' ? +e.target.value : e.target.value }));

  function openAdd() { setForm({ ...blank, id: Date.now() }); setStopsInput(''); setEditing(false); setShow(true); }
  function openEdit(r: Route) { setForm(r); setStopsInput(r.stops.join(', ')); setEditing(true); setShow(true); }
  function del(id: number) { if (confirm('Delete route?')) setList(p => p.filter(r => r.id !== id)); }
  function save(e: React.FormEvent) {
    e.preventDefault();
    if (!form.name.trim()) return alert('Route name required');
    const stops = stopsInput.split(',').map(s => s.trim()).filter(Boolean);
    const entry = { ...form, stops };
    if (editing) setList(p => p.map(r => r.id === entry.id ? entry : r));
    else setList(p => [entry, ...p]);
    setShow(false);
  }

  return (
    <section className="container">
      <header className="page-header">
        <div><h1>Transport</h1><p className="muted">Bus routes, drivers and student allocation.</p></div>
        <div className="toolbar">
          <input className="search" value={q} onChange={e => setQ(e.target.value)} placeholder="Search route, driver…" />
          <button className="btn-gold" onClick={openAdd}>+ Add Route</button>
        </div>
      </header>

      <div className="grid-3" style={{ marginBottom: 18 }}>
        <div className="stat-card"><div className="stat-icon">🚌</div><div><div className="stat-value">{list.filter(r=>r.status==='Active').length}</div><div className="stat-label">Active Routes</div></div></div>
        <div className="stat-card"><div className="stat-icon">👥</div><div><div className="stat-value">{list.reduce((s,r)=>s+r.students,0)}</div><div className="stat-label">Students Using Transport</div></div></div>
        <div className="stat-card"><div className="stat-icon">🚗</div><div><div className="stat-value">{list.length}</div><div className="stat-label">Total Routes</div></div></div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        {filtered.map(r => (
          <div key={r.id} className="content-card" style={{ marginBottom: 0 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 6 }}>
                  <span style={{ fontWeight: 700, color: 'var(--gold)' }}>{r.number}</span>
                  <span style={{ fontWeight: 600, fontSize: 14 }}>{r.name}</span>
                  <span className={`badge ${r.status === 'Active' ? 'badge-green' : 'badge-gray'}`}>{r.status}</span>
                </div>
                <div style={{ fontSize: 12.5, color: 'rgba(207,207,207,0.6)', display: 'flex', gap: 20 }}>
                  <span>🧑‍✈️ {r.driver}</span>
                  <span>🚌 {r.vehicle}</span>
                  <span>⏰ Departs {r.departure}</span>
                  <span>👥 {r.students} students</span>
                </div>
                {expandedId === r.id && (
                  <div style={{ marginTop: 10 }}>
                    <div style={{ fontSize: 12, color: 'rgba(207,207,207,0.5)', marginBottom: 4 }}>STOPS</div>
                    <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                      {r.stops.map((s, i) => (
                        <span key={i} style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                          <span className="badge badge-gray">{i + 1}. {s}</span>
                          {i < r.stops.length - 1 && <span style={{ color: 'rgba(207,207,207,0.3)', fontSize: 12 }}>→</span>}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
              <div style={{ display: 'flex', gap: 6, marginLeft: 12, flexShrink: 0 }}>
                <button className="btn-muted btn-sm" onClick={() => setExpandedId(expandedId === r.id ? null : r.id)}>
                  {expandedId === r.id ? 'Hide' : 'Stops'}
                </button>
                <button className="btn-muted btn-sm" onClick={() => openEdit(r)}>Edit</button>
                <button className="btn-danger" onClick={() => del(r.id)}>Delete</button>
              </div>
            </div>
          </div>
        ))}
        {filtered.length === 0 && <p className="muted" style={{ textAlign: 'center', padding: '30px 0' }}>No routes found</p>}
      </div>

      {show && (
        <div className="modal-backdrop">
          <form className="modal" onSubmit={save}>
            <h3>{editing ? 'Edit Route' : 'Add Route'}</h3>
            <label>Route Number <input name="number"    value={form.number}    onChange={ch} placeholder="R-06" /></label>
            <label>Route Name   <input name="name"      value={form.name}      onChange={ch} /></label>
            <label>Driver       <input name="driver"    value={form.driver}    onChange={ch} /></label>
            <label>Vehicle No.  <input name="vehicle"   value={form.vehicle}   onChange={ch} /></label>
            <label>Departure    <input name="departure" value={form.departure} onChange={ch} type="time" /></label>
            <label>Students     <input name="students"  value={form.students}  onChange={ch} type="number" min={0} /></label>
            <label>Stops (comma-separated)
              <input value={stopsInput} onChange={e => setStopsInput(e.target.value)} placeholder="Main Gate, City Centre, …" />
            </label>
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
