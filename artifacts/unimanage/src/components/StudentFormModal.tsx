import { useState } from 'react';

interface Student {
  id: number;
  name: string;
  email: string;
  program: string;
}

interface Props {
  onClose: () => void;
  onSave: (student: Student) => void;
}

export default function StudentFormModal({ onClose, onSave }: Props) {
  const [form, setForm] = useState<Student>({ id: Date.now(), name: '', email: '', program: '' });

  function change(e: React.ChangeEvent<HTMLInputElement>) {
    setForm(f => ({ ...f, [e.target.name]: e.target.value }));
  }

  function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.name) return alert('Name required');
    onSave(form);
  }

  return (
    <div className="modal-backdrop" role="dialog" aria-modal="true">
      <form className="modal" onSubmit={submit}>
        <h3>Add Student</h3>
        <label>Name<input name="name" value={form.name} onChange={change} /></label>
        <label>Email<input name="email" value={form.email} onChange={change} /></label>
        <label>Program<input name="program" value={form.program} onChange={change} /></label>

        <div className="modal-actions">
          <button type="button" className="btn-muted" onClick={onClose}>Cancel</button>
          <button type="submit" className="btn-gold">Save</button>
        </div>
      </form>
    </div>
  );
}
