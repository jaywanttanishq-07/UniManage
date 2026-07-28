import { useState } from 'react';

export default function SettingsPage() {
  const [general, setGeneral] = useState({
    uniName: 'UniManage University',
    address: '123 University Road, Bangalore, Karnataka',
    phone: '+91 80 1234 5678',
    email: 'admin@unimanage.edu',
    website: 'https://www.unimanage.edu',
    established: '1975',
  });

  const [academic, setAcademic] = useState({
    currentSemester: 'Semester 5 — Spring 2026',
    academicYear: '2025–2026',
    gradingSystem: 'Percentage',
    attendanceMin: '75',
    finePerDay: '500',
  });

  const [notif, setNotif] = useState({
    emailAlerts: true,
    feeReminders: true,
    examNotices: true,
    libraryDue: false,
  });

  const [saved, setSaved] = useState(false);

  function save(e: React.FormEvent) {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  }

  function chG(e: React.ChangeEvent<HTMLInputElement>) { setGeneral(g => ({ ...g, [e.target.name]: e.target.value })); }
  function chA(e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) { setAcademic(a => ({ ...a, [e.target.name]: e.target.value })); }
  function chN(key: keyof typeof notif) { setNotif(n => ({ ...n, [key]: !n[key] })); }

  return (
    <section className="container">
      <header className="page-header">
        <div><h1>Settings</h1><p className="muted">Configure university preferences and system options.</p></div>
        {saved && <span className="badge badge-green" style={{ padding: '8px 16px', fontSize: 13 }}>✓ Changes saved</span>}
      </header>

      <form onSubmit={save}>
        {/* General */}
        <div className="content-card">
          <div className="settings-group">
            <h3>General Information</h3>
            {([
              ['uniName',    'University Name',   'text'],
              ['address',    'Address',           'text'],
              ['phone',      'Phone Number',      'tel'],
              ['email',      'Email Address',     'email'],
              ['website',    'Website URL',       'url'],
              ['established','Year Established',  'text'],
            ] as [keyof typeof general, string, string][]).map(([name, label, type]) => (
              <div key={name} className="settings-row">
                <label>{label}</label>
                <input name={name} type={type} value={general[name]} onChange={chG} />
              </div>
            ))}
          </div>
        </div>

        {/* Academic */}
        <div className="content-card">
          <div className="settings-group">
            <h3>Academic Configuration</h3>
            <div className="settings-row">
              <label>Current Semester</label>
              <input name="currentSemester" value={academic.currentSemester} onChange={chA} />
            </div>
            <div className="settings-row">
              <label>Academic Year</label>
              <input name="academicYear" value={academic.academicYear} onChange={chA} />
            </div>
            <div className="settings-row">
              <label>Grading System</label>
              <select name="gradingSystem" value={academic.gradingSystem} onChange={chA}>
                {['Percentage','GPA (4.0)','GPA (10.0)','Letter Grade'].map(g => <option key={g}>{g}</option>)}
              </select>
            </div>
            <div className="settings-row">
              <label>Minimum Attendance (%)</label>
              <input name="attendanceMin" value={academic.attendanceMin} onChange={chA} type="number" min={0} max={100} />
            </div>
            <div className="settings-row">
              <label>Late Fee Fine (₹ per day)</label>
              <input name="finePerDay" value={academic.finePerDay} onChange={chA} type="number" min={0} />
            </div>
          </div>
        </div>

        {/* Notifications */}
        <div className="content-card">
          <div className="settings-group">
            <h3>Notification Preferences</h3>
            {([
              ['emailAlerts',  'Email Alerts for Admin Actions'],
              ['feeReminders', 'Automated Fee Payment Reminders'],
              ['examNotices',  'Exam Schedule Notifications'],
              ['libraryDue',   'Library Book Due Date Reminders'],
            ] as [keyof typeof notif, string][]).map(([key, label]) => (
              <div key={key} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14, maxWidth: 420 }}>
                <span style={{ fontSize: 13 }}>{label}</span>
                <div
                  onClick={() => chN(key)}
                  style={{
                    width: 44, height: 24, borderRadius: 12, cursor: 'pointer',
                    background: notif[key] ? 'linear-gradient(90deg, var(--gold), var(--gold-dark))' : 'rgba(255,255,255,0.08)',
                    position: 'relative', transition: 'background .2s',
                  }}
                >
                  <div style={{
                    position: 'absolute', top: 3, left: notif[key] ? 22 : 3,
                    width: 18, height: 18, borderRadius: '50%',
                    background: notif[key] ? '#071017' : 'rgba(207,207,207,0.4)',
                    transition: 'left .2s',
                  }} />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div style={{ display: 'flex', gap: 12 }}>
          <button type="submit" className="btn-gold">Save Changes</button>
          <button type="button" className="btn-muted">Reset to Defaults</button>
        </div>
      </form>
    </section>
  );
}
