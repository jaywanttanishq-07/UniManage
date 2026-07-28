import { useNavigate } from 'react-router-dom';

const stats = [
  { label: 'Total Students', value: '1,245', icon: '🎓' },
  { label: 'Teachers',       value: '86',    icon: '👨‍🏫' },
  { label: 'Active Courses', value: '54',    icon: '📚' },
  { label: 'Departments',    value: '12',    icon: '🏛️' },
];

const activity = [
  { time: 'Just now',   text: 'New enrollment: Ananya R. — B.Sc Computer Science' },
  { time: '2 min ago',  text: 'Fee payment received: Ben Patel — ₹45,000' },
  { time: '15 min ago', text: 'Exam schedule published for Spring Term 2026' },
  { time: '1 hr ago',   text: 'Library book returned: "Operating Systems" by Daniel Kim' },
  { time: '2 hrs ago',  text: 'Notice posted: Holiday on 30 July 2026' },
  { time: 'Today',      text: 'Transport Route B updated — new stop added at South Gate' },
];

const upcoming = [
  { date: 'Jul 30', event: 'Mid-Term Exams begin',       badge: 'badge-yellow' },
  { date: 'Aug 02', event: 'Fee due date — Q3',          badge: 'badge-red' },
  { date: 'Aug 05', event: 'Faculty Development Program', badge: 'badge-blue' },
  { date: 'Aug 10', event: 'Library catalogue update',   badge: 'badge-gray' },
];

function StatCard({ label, value, icon, to }: { label: string; value: string; icon: string; to: string }) {
  const nav = useNavigate();
  return (
    <div className="stat-card" onClick={() => nav(to)} style={{ cursor: 'pointer' }}>
      <div className="stat-icon">{icon}</div>
      <div>
        <div className="stat-value">{value}</div>
        <div className="stat-label">{label}</div>
      </div>
    </div>
  );
}

export default function Dashboard() {
  return (
    <section className="container">
      <header className="page-header">
        <div>
          <h1>Dashboard</h1>
          <p className="muted">Welcome back — here's what's happening at your university.</p>
        </div>
      </header>

      <div className="grid-4">
        <StatCard label="Total Students" value="1,245" icon="🎓" to="/students" />
        <StatCard label="Teachers"       value="86"    icon="👨‍🏫" to="/teachers" />
        <StatCard label="Active Courses" value="54"    icon="📚" to="/courses" />
        <StatCard label="Departments"    value="12"    icon="🏛️" to="/departments" />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
        <div className="content-card">
          <h2>Recent Activity</h2>
          {activity.map((a, i) => (
            <div key={i} style={{ display: 'flex', gap: 10, marginBottom: 10, alignItems: 'flex-start' }}>
              <span style={{ fontSize: 11, color: 'rgba(207,207,207,0.4)', whiteSpace: 'nowrap', paddingTop: 1 }}>{a.time}</span>
              <span style={{ fontSize: 13 }}>{a.text}</span>
            </div>
          ))}
        </div>

        <div className="content-card">
          <h2>Upcoming Events</h2>
          {upcoming.map((u, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10 }}>
              <span style={{ fontSize: 11, fontWeight: 700, color: 'var(--gold)', minWidth: 44 }}>{u.date}</span>
              <span style={{ fontSize: 13, flex: 1 }}>{u.event}</span>
              <span className={`badge ${u.badge}`}>{u.badge.replace('badge-', '')}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="grid-3" style={{ marginTop: 2 }}>
        {[
          { label: 'Pending Fee Dues', value: '38 students', icon: '💳', badge: 'badge-red' },
          { label: 'Library Overdue', value: '14 books',     icon: '📖', badge: 'badge-yellow' },
          { label: 'Hostel Vacancies', value: '7 rooms',     icon: '🛏️', badge: 'badge-green' },
        ].map((c, i) => (
          <div key={i} className="stat-card">
            <div className="stat-icon">{c.icon}</div>
            <div>
              <div className="stat-value" style={{ fontSize: 16 }}>{c.value}</div>
              <div className="stat-label">{c.label}</div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
