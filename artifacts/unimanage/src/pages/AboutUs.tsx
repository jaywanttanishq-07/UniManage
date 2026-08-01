import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Target, Eye, Heart } from 'lucide-react';

const TEAM = [
  { name: 'Dr. Priya Sharma', role: 'Vice Chancellor', initials: 'PS', color: '#d4af37' },
  { name: 'Prof. Arjun Mehta', role: 'Academic Director', initials: 'AM', color: '#1a56db' },
  { name: 'Ms. Kavya Nair', role: 'Registrar', initials: 'KN', color: '#d4af37' },
  { name: 'Mr. Rohit Verma', role: 'Finance Controller', initials: 'RV', color: '#1a56db' },
  { name: 'Dr. Sneha Patel', role: 'Dean of Students', initials: 'SP', color: '#d4af37' },
  { name: 'Mr. Aditya Kumar', role: 'IT Administrator', initials: 'AK', color: '#1a56db' },
];

const VALUES = [
  { Icon: Target, title: 'Our Mission', text: 'To empower educational institutions with intelligent, intuitive tools that free up time for what matters — teaching and learning.' },
  { Icon: Eye, title: 'Our Vision', text: 'A world where every university runs on data-driven decisions, transparent processes, and seamless digital experiences for students and faculty.' },
  { Icon: Heart, title: 'Our Values', text: 'Excellence, integrity, and accessibility. We build tools that are fair, transparent, and built for everyone on campus.' },
];

export default function AboutUs() {
  const navigate = useNavigate();

  return (
    <div className="home-page">
      {/* Header */}
      <section className="home-hero" style={{ minHeight: '40vh' }}>
        <div className="home-hero-inner">
          <button className="home-back-btn" onClick={() => navigate(-1)}>
            <ArrowLeft size={14} /> Back
          </button>
          <div className="home-badge">🏛️ Who We Are</div>
          <h1 className="home-title" style={{ fontSize: 'clamp(2rem, 5vw, 3.2rem)' }}>
            About <span className="home-title-accent">UniManage</span>
          </h1>
          <p className="home-subtitle" style={{ maxWidth: 560 }}>
            Built by educators, for educators — UniManage has been helping universities
            streamline operations since 2019.
          </p>
        </div>
      </section>

      {/* Story */}
      <section className="home-features-section">
        <div className="home-section-inner">
          <div className="about-story-grid">
            <div>
              <h2 className="home-section-title" style={{ textAlign: 'left', marginBottom: 16 }}>Our Story</h2>
              <p className="about-story-text">
                UniManage started as an internal tool at a mid-sized engineering college in Bangalore.
                The administration team was drowning in spreadsheets, disconnected databases, and
                paper-based workflows. Students couldn't check their results online, faculty had no
                central place for attendance, and fee collection was a monthly nightmare.
              </p>
              <p className="about-story-text">
                We built UniManage to solve those exact problems. Today it serves universities across
                India, managing over 50,000 students, hundreds of faculty members, and millions of
                records — all from a single, elegant interface.
              </p>
            </div>
            <div className="about-highlight-box">
              <div className="about-highlight-item">
                <span className="about-highlight-num">50K+</span>
                <span className="about-highlight-label">Students managed</span>
              </div>
              <div className="about-highlight-item">
                <span className="about-highlight-num">200+</span>
                <span className="about-highlight-label">Institutions served</span>
              </div>
              <div className="about-highlight-item">
                <span className="about-highlight-num">99.9%</span>
                <span className="about-highlight-label">Uptime guarantee</span>
              </div>
              <div className="about-highlight-item">
                <span className="about-highlight-num">2019</span>
                <span className="about-highlight-label">Founded</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="home-stats-section">
        <div className="home-section-inner">
          <div className="home-section-header">
            <h2 className="home-section-title">What Drives Us</h2>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 20 }}>
            {VALUES.map(({ Icon, title, text }) => (
              <div key={title} className="home-feature-card" style={{ textAlign: 'left' }}>
                <div className="home-feature-icon" style={{ marginBottom: 12 }}><Icon size={24} /></div>
                <h3 className="home-feature-title">{title}</h3>
                <p className="home-feature-desc">{text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="home-features-section">
        <div className="home-section-inner">
          <div className="home-section-header">
            <h2 className="home-section-title">Leadership Team</h2>
            <p className="home-section-sub">The people keeping UniManage running</p>
          </div>
          <div className="about-team-grid">
            {TEAM.map(m => (
              <div key={m.name} className="about-team-card">
                <div className="about-team-avatar" style={{ background: m.color }}>
                  {m.initials}
                </div>
                <div className="about-team-name">{m.name}</div>
                <div className="about-team-role">{m.role}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <footer className="home-footer">
        <div className="home-footer-inner">
          <div className="home-footer-brand">
            <div className="logo-mark" style={{ width: 36, height: 36, fontSize: 13 }}>UM</div>
            <span className="home-footer-name">UniManage</span>
          </div>
          <div className="home-footer-links">
            <button className="home-footer-link" onClick={() => navigate('/')}>Home</button>
            <button className="home-footer-link" onClick={() => navigate('/contact')}>Contact</button>
            <button className="home-footer-link" onClick={() => navigate('/dashboard')}>Dashboard</button>
          </div>
          <span style={{ fontSize: 12, opacity: 0.4 }}>© {new Date().getFullYear()} UniManage</span>
        </div>
      </footer>
    </div>
  );
}
