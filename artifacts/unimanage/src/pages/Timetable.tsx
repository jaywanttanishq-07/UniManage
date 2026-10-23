import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';

const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
const PERIODS = [
  '8:00–9:00',
  '9:00–10:00',
  '10:00–11:00',
  '11:00–12:00',
  '12:00–1:00',
  '2:00–3:00',
  '3:00–4:00',
];

interface Slot { subject: string; room: string; }
type Grid = Record<string, Record<string, Slot | null>>;

const INIT_GRID: Grid = {
  Monday:    { '8:00–9:00': { subject: 'CS101', room: 'R-101' }, '9:00–10:00': { subject: 'MTH201', room: 'R-203' }, '10:00–11:00': null, '11:00–12:00': { subject: 'BIO150', room: 'Lab-1' }, '12:00–1:00': null, '2:00–3:00': { subject: 'BUS201', room: 'R-305' }, '3:00–4:00': null },
  Tuesday:   { '8:00–9:00': null, '9:00–10:00': { subject: 'CHM101', room: 'Lab-2' }, '10:00–11:00': { subject: 'CS302', room: 'R-101' }, '11:00–12:00': null, '12:00–1:00': { subject: 'ME201', room: 'R-202' }, '2:00–3:00': null, '3:00–4:00': { subject: 'MTH201', room: 'R-203' } },
  Wednesday: { '8:00–9:00': { subject: 'BIO150', room: 'Lab-1' }, '9:00–10:00': null, '10:00–11:00': { subject: 'BUS201', room: 'R-305' }, '11:00–12:00': { subject: 'CHM101', room: 'Lab-2' }, '12:00–1:00': null, '2:00–3:00': { subject: 'CS101', room: 'R-101' }, '3:00–4:00': null },
  Thursday:  { '8:00–9:00': { subject: 'ME201', room: 'R-202' }, '9:00–10:00': { subject: 'CS302', room: 'R-101' }, '10:00–11:00': null, '11:00–12:00': { subject: 'MTH201', room: 'R-203' }, '12:00–1:00': null, '2:00–3:00': null, '3:00–4:00': { subject: 'BIO150', room: 'Lab-1' } },
  Friday:    { '8:00–9:00': null, '9:00–10:00': { subject: 'BUS201', room: 'R-305' }, '10:00–11:00': { subject: 'ME201', room: 'R-202' }, '11:00–12:00': null, '12:00–1:00': { subject: 'CS101', room: 'R-101' }, '2:00–3:00': { subject: 'CHM101', room: 'Lab-2' }, '3:00–4:00': null },
};

export default function Timetable() {
  const { role } = useAuth();
  const canManage = role === 'admin' || role === 'teacher';
  const [grid, setGrid] = useState<Grid>(INIT_GRID);
  const [edit, setEdit] = useState<{ day: string; period: string } | null>(null);
  const [form, setForm] = useState({ subject: '', room: '' });

  function openEdit(day: string, period: string) {
    const slot = grid[day][period];
    setForm(slot ?? { subject: '', room: '' });
    setEdit({ day, period });
  }

  function save(e: React.FormEvent) {
    e.preventDefault();
    if (!edit) return;
    setGrid(g => ({
      ...g,
      [edit.day]: {
        ...g[edit.day],
        [edit.period]: form.subject.trim()
          ? { subject: form.subject.trim(), room: form.room.trim() }
          : null,
      },
    }));
    setEdit(null);
  }

  function clear() {
    if (!edit) return;
    setGrid(g => ({ ...g, [edit.day]: { ...g[edit.day], [edit.period]: null } }));
    setEdit(null);
  }

  return (
    <section className="container">
      <header className="page-header">
        <div>
          <h1>Timetable</h1>
          <p className="muted">Weekly class schedule — click any slot to edit.</p>
        </div>
      </header>

      {/* Scroll wrapper — lets table scroll horizontally on small screens */}
      <div className="content-card" style={{ padding: 0, overflow: 'hidden' }}>
        <div className="tt-scroll-wrap">
          <table className="tt-table">
            <thead>
              <tr>
                {/* Period column header */}
                <th className="tt-th tt-th-period">Period</th>
                {/* Day column headers — gold coloured */}
                {DAYS.map(day => (
                  <th key={day} className="tt-th tt-th-day">{day}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {PERIODS.map(period => (
                <tr key={period} className="tt-row">
                  <td className="tt-td tt-td-period">{period}</td>
                  {DAYS.map(day => {
                    const slot = grid[day][period];
                    return (
                      <td
                        key={day}
                        className={`tt-td tt-td-slot${slot ? ' tt-td-filled' : ' tt-td-empty'}`}
                        onClick={canManage ? () => openEdit(day, period) : undefined}
                        style={{ cursor: canManage ? 'pointer' : 'default' }}
                      >
                        {slot ? (
                          <>
                            <span className="tt-subject">{slot.subject}</span>
                            <span className="tt-room">{slot.room}</span>
                          </>
                        ) : (
                          <span className="tt-empty-dash">—</span>
                        )}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {canManage && edit && (
        <div className="modal-backdrop">
          <form className="modal" onSubmit={save} style={{ minWidth: 300 }}>
            <h3>Edit Slot — {edit.day}, {edit.period}</h3>
            <label>
              Subject / Course Code
              <input
                value={form.subject}
                onChange={e => setForm(f => ({ ...f, subject: e.target.value }))}
                placeholder="CS101"
              />
            </label>
            <label>
              Room
              <input
                value={form.room}
                onChange={e => setForm(f => ({ ...f, room: e.target.value }))}
                placeholder="R-101"
              />
            </label>
            <div className="modal-actions">
              <button type="button" className="btn-danger" style={{ marginRight: 'auto' }} onClick={clear}>
                Clear Slot
              </button>
              <button type="button" className="btn-muted" onClick={() => setEdit(null)}>Cancel</button>
              <button type="submit" className="btn-gold">Save</button>
            </div>
          </form>
        </div>
      )}
    </section>
  );
}
