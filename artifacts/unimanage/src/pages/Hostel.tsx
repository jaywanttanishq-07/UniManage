import { useState } from 'react';

interface Room { id: number; number: string; block: string; type: string; capacity: number; occupants: string[]; status: string; }

const INITIAL: Room[] = [
  { id:1,  number:'A-101', block:'Block A', type:'Single', capacity:1, occupants:['Alice Johnson'], status:'Occupied' },
  { id:2,  number:'A-102', block:'Block A', type:'Single', capacity:1, occupants:[],                status:'Vacant' },
  { id:3,  number:'A-201', block:'Block A', type:'Double', capacity:2, occupants:['Ben Patel','Frank Lee'], status:'Occupied' },
  { id:4,  number:'B-101', block:'Block B', type:'Double', capacity:2, occupants:['Carla Gomez'],   status:'Partial' },
  { id:5,  number:'B-102', block:'Block B', type:'Triple', capacity:3, occupants:['Eva Singh','Grace Wu'], status:'Partial' },
  { id:6,  number:'B-201', block:'Block B', type:'Single', capacity:1, occupants:[],                status:'Vacant' },
  { id:7,  number:'C-101', block:'Block C', type:'Triple', capacity:3, occupants:['Daniel Kim','Henry Brown','Alice Lee'], status:'Occupied' },
  { id:8,  number:'C-102', block:'Block C', type:'Double', capacity:2, occupants:[],                status:'Maintenance' },
];

function statusBadge(s: string) {
  if (s === 'Occupied') return 'badge-blue';
  if (s === 'Vacant')   return 'badge-green';
  if (s === 'Partial')  return 'badge-yellow';
  return 'badge-gray';
}

const blank: Room = { id:0, number:'', block:'Block A', type:'Single', capacity:1, occupants:[], status:'Vacant' };

export default function Hostel() {
  const [list, setList] = useState<Room[]>(INITIAL);
  const [q, setQ] = useState('');
  const [filter, setFilter] = useState('All');
  const [show, setShow] = useState(false);
  const [form, setForm] = useState<Room>(blank);
  const [occupantInput, setOccupantInput] = useState('');
  const [editing, setEditing] = useState(false);

  const filtered = list
    .filter(r => filter === 'All' || r.status === filter)
    .filter(r => r.number.toLowerCase().includes(q.toLowerCase()) || r.block.toLowerCase().includes(q.toLowerCase()));

  function openAdd() { setForm({ ...blank, id: Date.now() }); setOccupantInput(''); setEditing(false); setShow(true); }
  function openEdit(r: Room) { setForm(r); setOccupantInput(r.occupants.join(', ')); setEditing(true); setShow(true); }
  function del(id: number) { if (confirm('Delete room?')) setList(p => p.filter(r => r.id !== id)); }

  function computeStatus(r: Room) {
    if (r.status === 'Maintenance') return 'Maintenance';
    if (r.occupants.length === 0) return 'Vacant';
    if (r.occupants.length < r.capacity) return 'Partial';
    return 'Occupied';
  }

  function save(e: React.FormEvent) {
    e.preventDefault();
    if (!form.number.trim()) return alert('Room number required');
    const occ = occupantInput.split(',').map(s => s.trim()).filter(Boolean);
    const entry = { ...form, occupants: occ, status: computeStatus({ ...form, occupants: occ }) };
    if (editing) setList(p => p.map(r => r.id === entry.id ? entry : r));
    else setList(p => [entry, ...p]);
    setShow(false);
  }

  const ch = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
    setForm(f => ({ ...f, [e.target.name]: e.target.type === 'number' ? +e.target.value : e.target.value }));

  const vacant = list.filter(r => r.status === 'Vacant').length;
  const total  = list.reduce((s,r) => s + r.capacity, 0);
  const occupied = list.reduce((s,r) => s + r.occupants.length, 0);

  return (
    <section className="container">
      <header className="page-header">
        <div><h1>Hostel</h1><p className="muted">Room allocation and occupancy management.</p></div>
        <div className="toolbar">
          <input className="search" value={q} onChange={e => setQ(e.target.value)} placeholder="Search room or block…" />
          {(['All','Occupied','Vacant','Partial','Maintenance'] as const).map(t => (
            <button key={t} className={filter === t ? 'btn-gold btn-sm' : 'btn-muted btn-sm'} onClick={() => setFilter(t)}>{t}</button>
          ))}
          <button className="btn-gold" onClick={openAdd}>+ Add Room</button>
        </div>
      </header>

      <div className="grid-3" style={{ marginBottom: 18 }}>
        <div className="stat-card"><div className="stat-icon">🏠</div><div><div className="stat-value">{list.length}</div><div className="stat-label">Total Rooms</div></div></div>
        <div className="stat-card"><div className="stat-icon">👤</div><div><div className="stat-value">{occupied}/{total}</div><div className="stat-label">Occupancy</div></div></div>
        <div className="stat-card"><div className="stat-icon">✅</div><div><div className="stat-value">{vacant}</div><div className="stat-label">Vacant Rooms</div></div></div>
      </div>

      <div className="table-card">
        <table className="uni-table">
          <thead><tr><th>Room</th><th>Block</th><th>Type</th><th>Capacity</th><th>Occupants</th><th>Status</th><th>Actions</th></tr></thead>
          <tbody>
            {filtered.length === 0
              ? <tr className="empty-row"><td colSpan={7}>No rooms found</td></tr>
              : filtered.map(r => (
                <tr key={r.id}>
                  <td style={{ fontWeight: 700, color: 'var(--gold)' }}>{r.number}</td>
                  <td>{r.block}</td>
                  <td>{r.type}</td>
                  <td>{r.occupants.length}/{r.capacity}</td>
                  <td className="muted" style={{ maxWidth: 200 }}>{r.occupants.join(', ') || '—'}</td>
                  <td><span className={`badge ${statusBadge(r.status)}`}>{r.status}</span></td>
                  <td style={{ display: 'flex', gap: 6 }}>
                    <button className="btn-muted btn-sm" onClick={() => openEdit(r)}>Edit</button>
                    <button className="btn-danger" onClick={() => del(r.id)}>Delete</button>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>

      {show && (
        <div className="modal-backdrop">
          <form className="modal" onSubmit={save}>
            <h3>{editing ? 'Edit Room' : 'Add Room'}</h3>
            <label>Room Number <input name="number"   value={form.number}   onChange={ch} /></label>
            <label>Block       <input name="block"    value={form.block}    onChange={ch} /></label>
            <label>Type
              <select name="type" value={form.type} onChange={ch}>
                {['Single','Double','Triple'].map(t => <option key={t}>{t}</option>)}
              </select>
            </label>
            <label>Capacity    <input name="capacity" value={form.capacity} onChange={ch} type="number" min={1} /></label>
            <label>Occupants (comma-separated)
              <input value={occupantInput} onChange={e => setOccupantInput(e.target.value)} placeholder="Alice, Ben, …" />
            </label>
            <label>Status
              <select name="status" value={form.status} onChange={ch}>
                {['Vacant','Occupied','Partial','Maintenance'].map(s => <option key={s}>{s}</option>)}
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
