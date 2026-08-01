import { useState, useEffect } from 'react';
import { useTheme } from '../contexts/ThemeContext';
import { Sun, Moon } from 'lucide-react';

const STORAGE_KEY = 'um-settings';

interface GeneralSettings {
  uniName: string;
  address: string;
  phone: string;
  email: string;
  website: string;
  established: string;
}

interface AcademicSettings {
  currentSemester: string;
  academicYear: string;
  gradingSystem: string;
  attendanceMin: string;
  finePerDay: string;
}

interface NotifSettings {
  emailAlerts: boolean;
  feeReminders: boolean;
  examNotices: boolean;
  libraryDue: boolean;
}

interface StoredSettings {
  general: GeneralSettings;
  academic: AcademicSettings;
  notif: NotifSettings;
}

const DEFAULTS: StoredSettings = {
  general: {
    uniName: 'UniManage University',
    address: '123 University Road, Bangalore, Karnataka',
    phone: '+91 80 1234 5678',
    email: 'admin@unimanage.edu',
    website: 'https://www.unimanage.edu',
    established: '1975',
  },
  academic: {
    currentSemester: 'Semester 5 — Spring 2026',
    academicYear: '2025–2026',
    gradingSystem: 'Percentage',
    attendanceMin: '75',
    finePerDay: '500',
  },
  notif: {
    emailAlerts: true,
    feeReminders: true,
    examNotices: true,
    libraryDue: false,
  },
};

function loadSettings(): StoredSettings {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return { ...DEFAULTS, general: { ...DEFAULTS.general }, academic: { ...DEFAULTS.academic }, notif: { ...DEFAULTS.notif } };
    const parsed = JSON.parse(raw) as Partial<StoredSettings>;
    return {
      general: { ...DEFAULTS.general, ...parsed.general },
      academic: { ...DEFAULTS.academic, ...parsed.academic },
      notif: { ...DEFAULTS.notif, ...parsed.notif },
    };
  } catch {
    return { ...DEFAULTS, general: { ...DEFAULTS.general }, academic: { ...DEFAULTS.academic }, notif: { ...DEFAULTS.notif } };
  }
}

export default function SettingsPage() {
  const { theme, toggleTheme } = useTheme();
  const saved_settings = loadSettings();

  const [general, setGeneral] = useState<GeneralSettings>(saved_settings.general);
  const [academic, setAcademic] = useState<AcademicSettings>(saved_settings.academic);
  const [notif, setNotif] = useState<NotifSettings>(saved_settings.notif);
  const [saved, setSaved] = useState(false);

  // Persist any notif toggle immediately
  useEffect(() => {
    const current = loadSettings();
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ ...current, notif }));
  }, [notif]);

  function save(e: React.FormEvent) {
    e.preventDefault();
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ general, academic, notif }));
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  }

  function resetToDefaults() {
    setGeneral({ ...DEFAULTS.general });
    setAcademic({ ...DEFAULTS.academic });
    setNotif({ ...DEFAULTS.notif });
    localStorage.setItem(STORAGE_KEY, JSON.stringify(DEFAULTS));
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  }

  function chG(e: React.ChangeEvent<HTMLInputElement>) {
    setGeneral(g => ({ ...g, [e.target.name]: e.target.value }));
  }

  function chA(e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) {
    setAcademic(a => ({ ...a, [e.target.name]: e.target.value }));
  }

  function chN(key: keyof NotifSettings) {
    setNotif(n => ({ ...n, [key]: !n[key] }));
  }

  return (
    <section className="container">
      <header className="page-header">
        <div>
          <h1>Settings</h1>
          <p className="muted">Configure university preferences and system options.</p>
        </div>
        {saved && (
          <span className="badge badge-green" style={{ padding: '8px 16px', fontSize: 13 }}>
            ✓ Changes saved
          </span>
        )}
      </header>

      <form onSubmit={save}>

        {/* Appearance */}
        <div className="content-card">
          <div className="settings-group">
            <h3>Appearance</h3>
            <div className="settings-row" style={{ alignItems: 'center' }}>
              <label>Theme</label>
              <div style={{ display: 'flex', gap: 10 }}>
                <button
                  type="button"
                  className={theme === 'dark' ? 'btn-gold' : 'btn-muted'}
                  style={{ display: 'flex', alignItems: 'center', gap: 7, padding: '8px 16px', fontSize: 13 }}
                  onClick={() => { if (theme !== 'dark') toggleTheme(); }}
                >
                  <Moon size={14} /> Dark
                </button>
                <button
                  type="button"
                  className={theme === 'light' ? 'btn-gold' : 'btn-muted'}
                  style={{ display: 'flex', alignItems: 'center', gap: 7, padding: '8px 16px', fontSize: 13 }}
                  onClick={() => { if (theme !== 'light') toggleTheme(); }}
                >
                  <Sun size={14} /> Light
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* General */}
        <div className="content-card">
          <div className="settings-group">
            <h3>General Information</h3>
            {([
              ['uniName',    'University Name',  'text'],
              ['address',    'Address',          'text'],
              ['phone',      'Phone Number',     'tel'],
              ['email',      'Email Address',    'email'],
              ['website',    'Website URL',      'url'],
              ['established','Year Established', 'text'],
            ] as [keyof GeneralSettings, string, string][]).map(([name, label, type]) => (
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
                {['Percentage', 'GPA (4.0)', 'GPA (10.0)', 'Letter Grade'].map(g => (
                  <option key={g}>{g}</option>
                ))}
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
            ] as [keyof NotifSettings, string][]).map(([key, label]) => (
              <div key={key} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14, maxWidth: 440 }}>
                <span style={{ fontSize: 13 }}>{label}</span>
                <button
                  type="button"
                  role="switch"
                  aria-checked={notif[key]}
                  onClick={() => chN(key)}
                  style={{
                    width: 44, height: 24, borderRadius: 12, cursor: 'pointer', border: 'none', outline: 'none',
                    background: notif[key] ? 'linear-gradient(90deg, var(--gold), var(--gold-dark))' : 'var(--toggle-off-bg)',
                    position: 'relative', transition: 'background .2s', flexShrink: 0,
                  }}
                >
                  <div style={{
                    position: 'absolute', top: 3, left: notif[key] ? 22 : 3,
                    width: 18, height: 18, borderRadius: '50%',
                    background: notif[key] ? '#071017' : 'var(--toggle-knob)',
                    transition: 'left .2s',
                  }} />
                </button>
              </div>
            ))}
          </div>
        </div>

        <div style={{ display: 'flex', gap: 12 }}>
          <button type="submit" className="btn-gold">Save Changes</button>
          <button type="button" className="btn-muted" onClick={resetToDefaults}>Reset to Defaults</button>
        </div>
      </form>
    </section>
  );
}
