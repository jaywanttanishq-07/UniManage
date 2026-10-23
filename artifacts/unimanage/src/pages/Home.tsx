import { useNavigate } from 'react-router-dom';
import { useTheme } from '../contexts/ThemeContext';
import { GraduationCap, BookOpen, Users, Building2, Award, ArrowRight, Sun, Moon } from 'lucide-react';

const FEATURES = [
  { icon: <GraduationCap size={28} />, title: 'Student Management', desc: 'Enroll, track, and manage student records, attendance, and academic progress all in one place.' },
  { icon: <BookOpen size={28} />, title: 'Course & Timetable', desc: 'Plan courses, assign faculty, and publish timetables with ease. Fully customisable scheduling.' },
  { icon: <Users size={28} />, title: 'Faculty Portal', desc: 'Manage teacher profiles, departments, and workload distribution seamlessly.' },
  { icon: <Building2 size={28} />, title: 'Campus Operations', desc: 'Hostel, transport, library, and fee management — every campus service at your fingertips.' },
  { icon: <Award size={28} />, title: 'Exams & Results', desc: 'Schedule examinations, publish results, and generate comprehensive academic reports.' },
  { icon: <BookOpen size={28} />, title: 'Smart Analytics', desc: 'Real-time dashboards and reports give administrators actionable insights.' },
];

const STATS = [
  { value: '1,245', label: 'Active Students' },
  { value: '86', label: 'Faculty Members' },
  { value: '54', label: 'Courses Offered' },
  { value: '12', label: 'Departments' },
];

export default function Home() {
  const navigate = useNavigate();
  const { theme, toggleTheme } = useTheme();

  return (
    <div className="home-page">
      {/* Hero */}
      <section className="home-hero">
        <div className="home-hero-inner">
          <div className="home-badge">🎓 University Management System</div>
          <h1 className="home-title">
            Manage Your University<br />
            <span className="home-title-accent">Smarter & Faster</span>
          </h1>
          <p className="home-subtitle">
            UniManage brings students, faculty, courses, exams, fees, and campus operations
            under a single powerful platform — built for modern universities.
          </p>
          <div className="home-cta-row">
            <button className="btn-gold home-cta-btn" onClick={() => navigate('/dashboard')}>
              Go to Dashboard <ArrowRight size={16} style={{ marginLeft: 6 }} />
            </button>
            <button className="btn-muted home-cta-btn" onClick={() => navigate('/about')}>
              Learn More
            </button>
            <button className="btn-muted home-cta-btn" onClick={() => navigate('/students')}>
              Student Information
            </button>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="home-stats-section">
        <div className="home-section-inner">
          <div className="home-stats-grid">
            {STATS.map(s => (
              <div key={s.label} className="home-stat-card">
                <div className="home-stat-value">{s.value}</div>
                <div className="home-stat-label">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="home-features-section">
        <div className="home-section-inner">
          <div className="home-section-header">
            <h2 className="home-section-title">Everything You Need</h2>
            <p className="home-section-sub">A complete ecosystem for university administration</p>
          </div>
          <div className="home-features-grid">
            {FEATURES.map(f => (
              <div key={f.title} className="home-feature-card">
                <div className="home-feature-icon">{f.icon}</div>
                <h3 className="home-feature-title">{f.title}</h3>
                <p className="home-feature-desc">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Banner */}
      <section className="home-cta-section">
        <div className="home-section-inner home-cta-banner">
          <h2 className="home-cta-title">Ready to transform your campus?</h2>
          <p className="home-cta-sub">Jump into the dashboard and start managing your university today.</p>
          <button className="btn-gold home-cta-btn" onClick={() => navigate('/dashboard')}>
            Open Dashboard <ArrowRight size={16} style={{ marginLeft: 6 }} />
          </button>
        </div>
      </section>

      {/* Footer nav */}
      <footer className="home-footer">
        <div className="home-footer-inner">
          <div className="home-footer-brand">
            <div className="logo-mark" style={{ width: 36, height: 36, fontSize: 13 }}>UM</div>
            <span className="home-footer-name">UniManage</span>
          </div>
          <div className="home-footer-links">
            <button className="home-footer-link" onClick={() => navigate('/about')}>About Us</button>
            <button className="home-footer-link" onClick={() => navigate('/contact')}>Contact</button>
            <button className="home-footer-link" onClick={() => navigate('/dashboard')}>Dashboard</button>
          </div>
          <div className="home-footer-right">
            <button className="theme-toggle-btn" onClick={toggleTheme} title={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}>
              {theme === 'dark' ? <Sun size={16} /> : <Moon size={16} />}
            </button>
            <span style={{ fontSize: 12, opacity: 0.4, marginLeft: 12 }}>© {new Date().getFullYear()} UniManage</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
