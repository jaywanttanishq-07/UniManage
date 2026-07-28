import { useState } from 'react';
import type { Student } from '../pages/Students';

interface Props { initial?: Student; onClose: () => void; onSave: (s: Student) => void; }

const blank: Student = { id: 0, name: '', email: '', program: '', year: '1st', status: 'Active' };

export default function StudentFormModal({ initial, onClose, onSave }: Props) {
  const [form, setForm] = useState<Student>(initial ?? { ...blank, id: Date.now() });
  const ch = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
    setForm(f => ({ ...f, [e.target.name]: e.target.value }));
  function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.name.trim()) return alert('Name is required');
    onSave(form);
  }
  return (
    <div className="modal-backdrop" role="dialog" aria-modal="true">
      <form className="modal" onSubmit={submit}>
        <h3>{initial ? 'Edit Student' : 'Add Student'}</h3>
        <label>Full Name<input name="name"    value={form.name}    onChange={ch} placeholder="Alice Johnson" /></label>
        <label>Email   <input name="email"   value={form.email}   onChange={ch} placeholder="alice@example.edu" /></label>
        <label>Program <input name="program" value={form.program} onChange={ch} placeholder="Computer Science" /></label>
        <label>Year
          <select name="year" value={form.year} onChange={ch}>
            {['1st','2nd','3rd','4th'].map(y => <option key={y}>{y}</option>)}
          </select>
        </label>
        <label>Status
          <select name="status" value={form.status} onChange={ch}>
            {['Active','On Leave','Inactive'].map(s => <option key={s}>{s}</option>)}
          </select>
        </label>
        <div className="modal-actions">
          <button type="button" className="btn-muted" onClick={onClose}>Cancel</button>
          <button type="submit" className="btn-gold">Save</button>
        </div>
      </form>
    </div>
  );
}
