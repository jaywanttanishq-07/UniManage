import { useState, useEffect } from 'react';
import { useTheme } from '../contexts/ThemeContext';
import { useAuth  } from '../contexts/AuthContext';
import type { UserRole } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Sun, Moon } from 'lucide-react';

const STORAGE_KEY = 'um-settings';

interface GeneralSettings {
  uniName: string; address: string; phone: string;
  email: string;   website: string; established: string;
}
interface AcademicSettings {
  currentSemester: string; academicYear: string; gradingSystem: string;
  attendanceMin: string;   finePerDay: string;
}
interface NotifSettings {
  emailAlerts: boolean; feeReminders: boolean;
  examNotices: boolean; libraryDue: boolean;
}
interface StoredSettings {
  general: GeneralSettings; academic: AcademicSettings; notif: NotifSettings;
}

const DEFAULTS: StoredSettings = {
  general: {
    uniName: 'UniManage University',
    address: '123 University Road, Bangalore, Karnataka',
    phone: '+91 80 1234 5678', email: 'admin@unimanage.edu',
    website: 'https://www.unimanage.edu', established: '1975',
  },
  academic: {
    currentSemester: 'Semester 5 — Spring 2026', academicYear: '2025–2026',
    gradingSystem: 'Percentage', attendanceMin: '75', finePerDay: '500',
  },
  notif: { emailAlerts: true, feeReminders: true, examNotices: true, libraryDue: false },
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
  const { userId, logout, updateCredentials } = useAuth();
  const navigate = useNavigate();
  const s = loadSettings();

  // ── General / Academic / Notif state ──────────────────────────────────────
  const [general,  setGeneral]  = useState<GeneralSettings>(s.general);
  const [academic, setAcademic] = useState<AcademicSettings>(s.academic);
  const [notif,    setNotif]    = useState<NotifSettings>(s.notif);
  const [saved,    setSaved]    = useState(false);

  // ── Security (change credentials) state ───────────────────────────────────
  const [accountRole, setAccountRole] = useState<UserRole>('admin');
  const [newId,      setNewId]      = useState(userId);
  const [currentPw,  setCurrentPw]  = useState('');
  const [newPw,      setNewPw]      = useState('');
  const [confirmPw,  setConfirmPw]  = useState('');
  const [showPws,    setShowPws]    = useState(false);
  const [secMsg,     setSecMsg]     = useState<{ type: 'ok' | 'err'; text: string } | null>(null);

  // Persist notif toggles immediately
  useEffect(() => {
    const current = loadSettings();
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ ...current, notif }));
  }, [notif]);

  function save(e: React.FormEvent) {
    e.preventDefault();
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ general, academic, notif }));
    setSaved(true); setTimeout(() => setSaved(false), 2500);
  }
  function resetToDefaults() {
    setGeneral({ ...DEFAULTS.general }); setAcademic({ ...DEFAULTS.academic }); setNotif({ ...DEFAULTS.notif });
    localStorage.setItem(STORAGE_KEY, JSON.stringify(DEFAULTS));
    setSaved(true); setTimeout(() => setSaved(false), 2500);
  }
  function chG(e: React.ChangeEvent<HTMLInputElement>) { setGeneral(g => ({ ...g, [e.target.name]: e.target.value })); }
  function chA(e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) { setAcademic(a => ({ ...a, [e.target.name]: e.target.value })); }
  function chN(key: keyof NotifSettings) { setNotif(n => ({ ...n, [key]: !n[key] })); }

  function saveCredentials(e: React.FormEvent) {
    e.preventDefault();
    setSecMsg(null);
    if (newPw !== confirmPw) { setSecMsg({ type: 'err', text: 'New passwords do not match.' }); return; }
    const err = updateCredentials(accountRole, currentPw, newId, newPw);
    if (err) { setSecMsg({ type: 'err', text: err }); }
    else {
      setSecMsg({ type: 'ok', text: 'Credentials updated successfully.' });
      setCurrentPw(''); setNewPw(''); setConfirmPw('');
      setTimeout(() => setSecMsg(null), 3000);
    }
  }

  function handleLogout() {
    logout();
    navigate('/dashboard');
  }

  const Toggle = ({ checked, onChange }: { checked: boolean; onChange: () => void }) => (
    <button
      type="button" role="switch" aria-checked={checked} onClick={onChange}
      style={{
        width: 44, height: 24, borderRadius: 12, cursor: 'pointer', border: 'none', outline: 'none', flexShrink: 0,
        background: checked ? 'linear-gradient(90deg, var(--gold), var(--gold-dark))' : 'var(--toggle-off-bg)',
        position: 'relative', transition: 'background .2s',
      }}
    >
      <div style={{
        position: 'absolute', top: 3, left: checked ? 22 : 3,
        width: 18, height: 18, borderRadius: '50%',
        background: checked ? '#071017' : 'var(--toggle-knob)',
        transition: 'left .2s',
      }} />
    </button>
  );

  return (
    <section className="container">
      <header className="page-header">
        <div>
          <h1>Settings</h1>
          <p className="muted">Configure university preferences and system options.</p>
        </div>
        {saved && (
          <span className="badge badge-green" style={{ padding: '8px 16px', fontSize: 13 }}>✓ Changes saved</span>
        )}
      </header>

      <form onSubmit={save}>
        {/* ── General Information ─────────────────────────────────────────── */}
        <div className="content-card">
          <div className="settings-group">
            <h3>General Information</h3>
            {([
              ['uniName',     'University Name',  'text'],
              ['address',     'Address',          'text'],
              ['phone',       'Phone Number',      'tel'],
              ['email',       'Email Address',     'email'],
              ['website',     'Website URL',       'url'],
              ['established', 'Established Year',  'number'],
            ] as [keyof GeneralSettings, string, string][]).map(([name, label, type]) => (
              <div key={name} className="settings-row">
                <label>{label}</label>
                <input name={name} type={type} value={general[name]} onChange={chG} />
              </div>
            ))}
          </div>
        </div>

        {/* ── Academic ────────────────────────────────────────────────────── */}
        <div className="content-card">
          <div className="settings-group">
            <h3>Academic Settings</h3>
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
                <option>Percentage</option>
                <option>GPA (10-point)</option>
                <option>GPA (4-point)</option>
              </select>
            </div>
            <div className="settings-row">
              <label>Minimum Attendance (%)</label>
              <input name="attendanceMin" type="number" min={0} max={100} value={academic.attendanceMin} onChange={chA} />
            </div>
            <div className="settings-row">
              <label>Late Fee Fine (₹ per day)</label>
              <input name="finePerDay" type="number" min={0} value={academic.finePerDay} onChange={chA} />
            </div>
          </div>
        </div>

        {/* ── Appearance ──────────────────────────────────────────────────── */}
        <div className="content-card">
          <div className="settings-group">
            <h3>Appearance</h3>
            <p className="muted" style={{ fontSize: 13, marginBottom: 14 }}>Choose between dark and light theme.</p>
            <div style={{ display: 'flex', gap: 10 }}>
              <button
                type="button"
                onClick={() => theme !== 'dark' && toggleTheme()}
                className={theme === 'dark' ? 'btn-gold' : 'btn-muted'}
                style={{ display: 'flex', alignItems: 'center', gap: 6 }}
              >
                <Moon size={14} /> Dark
              </button>
              <button
                type="button"
                onClick={() => theme !== 'light' && toggleTheme()}
                className={theme === 'light' ? 'btn-gold' : 'btn-muted'}
                style={{ display: 'flex', alignItems: 'center', gap: 6 }}
              >
                <Sun size={14} /> Light
              </button>
            </div>
          </div>
        </div>

        {/* ── Notifications ───────────────────────────────────────────────── */}
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
                <Toggle checked={notif[key]} onChange={() => chN(key)} />
              </div>
            ))}
          </div>
        </div>

        <div style={{ display: 'flex', gap: 12, marginBottom: 32 }}>
          <button type="submit" className="btn-gold">Save Changes</button>
          <button type="button" className="btn-muted" onClick={resetToDefaults}>Reset to Defaults</button>
        </div>
      </form>

      {/* ── Security — change credentials ───────────────────────────────── */}
      <div className="content-card" style={{ marginBottom: 16 }}>
        <form onSubmit={saveCredentials}>
          <div className="settings-group">
            <h3>🔐 Security — Change Login Credentials</h3>
            <p className="muted" style={{ fontSize: 13, marginBottom: 18 }}>
              Signed in as <strong style={{ color: 'var(--gold)' }}>{userId}</strong>.
              Administrators can change the admin or teacher sign-in.
            </p>

            <div className="settings-row">
              <label>Account</label>
              <select
                value={accountRole}
                onChange={e => {
                  const nextRole = e.target.value as UserRole;
                  setAccountRole(nextRole);
                  setNewId(nextRole === 'admin' ? userId : '');
                }}
              >
                <option value="admin">Administration</option>
                <option value="teacher">Teacher</option>
              </select>
            </div>
            <div className="settings-row">
              <label>New Login ID</label>
              <input
                type="text"
                value={newId}
                onChange={e => setNewId(e.target.value)}
                placeholder="Enter new login ID"
                autoComplete="username"
              />
            </div>
            <div className="settings-row">
              <label>Your Current Admin Password</label>
              <input
                type={showPws ? 'text' : 'password'}
                value={currentPw}
                onChange={e => setCurrentPw(e.target.value)}
                placeholder="Your current password"
                autoComplete="current-password"
              />
            </div>
            <div className="settings-row">
              <label>New Password</label>
              <input
                type={showPws ? 'text' : 'password'}
                value={newPw}
                onChange={e => setNewPw(e.target.value)}
              placeholder="At least 8 characters"
                autoComplete="new-password"
              />
            </div>
            <div className="settings-row">
              <label>Confirm New Password</label>
              <input
                type={showPws ? 'text' : 'password'}
                value={confirmPw}
                onChange={e => setConfirmPw(e.target.value)}
                placeholder="Repeat new password"
                autoComplete="new-password"
              />
            </div>

            <label style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, cursor: 'pointer', marginBottom: 16 }}>
              <input type="checkbox" checked={showPws} onChange={() => setShowPws(v => !v)} />
              Show passwords
            </label>

            {secMsg && (
              <p style={{
                padding: '8px 14px', borderRadius: 8, fontSize: 13, marginBottom: 14,
                background: secMsg.type === 'ok' ? 'rgba(34,197,94,0.12)' : 'rgba(239,68,68,0.12)',
                color: secMsg.type === 'ok' ? '#22c55e' : '#ef4444',
                border: `1px solid ${secMsg.type === 'ok' ? 'rgba(34,197,94,0.3)' : 'rgba(239,68,68,0.3)'}`,
              }}>
                {secMsg.type === 'ok' ? '✓' : '✕'} {secMsg.text}
              </p>
            )}

            <button type="submit" className="btn-gold">Update Credentials</button>
          </div>
        </form>
      </div>

      {/* ── Logout ──────────────────────────────────────────────────────── */}
      <div className="content-card" style={{ marginBottom: 40 }}>
        <div className="settings-group">
          <h3>Session</h3>
          <p className="muted" style={{ fontSize: 13, marginBottom: 16 }}>
            Sign out of this device. You will need your ID and password to sign back in.
          </p>
          <button type="button" className="btn-danger" onClick={handleLogout}>
            Sign Out
          </button>
        </div>
      </div>
    </section>
  );
}
