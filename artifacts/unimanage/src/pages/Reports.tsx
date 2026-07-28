const deptEnrollment = [
  { label: 'Business',         value: 385, pct: 100 },
  { label: 'Computer Science', value: 312, pct: 81  },
  { label: 'Mechanical Eng.',  value: 240, pct: 62  },
  { label: 'Biology',          value: 198, pct: 51  },
  { label: 'Mathematics',      value: 145, pct: 38  },
  { label: 'Chemistry',        value: 132, pct: 34  },
];

const feeCollection = [
  { label: 'Paid',    value: 62, color: '#4ecb71' },
  { label: 'Partial', value: 23, color: '#d4af37' },
  { label: 'Unpaid',  value: 15, color: '#e05050' },
];

const examPerf = [
  { label: 'A+ (≥90%)', value: 14, pct: 100, color: '#4ecb71' },
  { label: 'A  (80–89)', value: 22, pct: 79,  color: '#5b9ff5' },
  { label: 'B  (70–79)', value: 31, pct: 56,  color: '#5b9ff5' },
  { label: 'C  (60–69)', value: 18, pct: 32,  color: '#d4af37' },
  { label: 'D  (50–59)', value:  9, pct: 16,  color: '#d4af37' },
  { label: 'F  (<50%)',  value:  6, pct: 11,  color: '#e05050' },
];

const hostelOccupancy = [
  { block: 'Block A', occupied: 2, total: 3 },
  { block: 'Block B', occupied: 3, total: 3 },
  { block: 'Block C', occupied: 2, total: 2 },
];

function BarChart({ data, labelWidth = 150 }: { data: { label: string; value: number; pct: number; color?: string }[]; labelWidth?: number }) {
  return (
    <div>
      {data.map((d, i) => (
        <div key={i} className="bar-row">
          <span className="bar-label" style={{ width: labelWidth }}>{d.label}</span>
          <div className="bar-track">
            <div className="bar-fill" style={{ width: `${d.pct}%`, background: d.color ? `${d.color}` : undefined }} />
          </div>
          <span className="bar-val">{d.value}</span>
        </div>
      ))}
    </div>
  );
}

export default function Reports() {
  return (
    <section className="container">
      <header className="page-header">
        <div><h1>Reports</h1><p className="muted">University-wide analytics and summary statistics.</p></div>
      </header>

      <div className="grid-4" style={{ marginBottom: 18 }}>
        {[
          { icon: '🎓', value: '1,245', label: 'Total Students' },
          { icon: '👨‍🏫', value: '86',    label: 'Teaching Staff' },
          { icon: '📚', value: '54',    label: 'Active Courses' },
          { icon: '✅', value: '87%',   label: 'Attendance Rate' },
        ].map((s, i) => (
          <div key={i} className="stat-card">
            <div className="stat-icon">{s.icon}</div>
            <div><div className="stat-value">{s.value}</div><div className="stat-label">{s.label}</div></div>
          </div>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 16 }}>
        <div className="content-card">
          <h2>Enrolment by Department</h2>
          <BarChart data={deptEnrollment} labelWidth={160} />
        </div>

        <div className="content-card">
          <h2>Exam Grade Distribution</h2>
          <BarChart data={examPerf} labelWidth={100} />
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
        <div className="content-card">
          <h2>Fee Collection Status</h2>
          <div style={{ display: 'flex', gap: 20, marginBottom: 16 }}>
            {feeCollection.map((f, i) => (
              <div key={i} style={{ textAlign: 'center' }}>
                <div style={{ fontSize: 28, fontWeight: 800, color: f.color }}>{f.value}%</div>
                <div style={{ fontSize: 12, color: 'rgba(207,207,207,0.5)' }}>{f.label}</div>
              </div>
            ))}
          </div>
          <BarChart
            data={feeCollection.map(f => ({ label: f.label, value: f.value, pct: f.value, color: f.color }))}
            labelWidth={80}
          />
        </div>

        <div className="content-card">
          <h2>Hostel Occupancy</h2>
          {hostelOccupancy.map((h, i) => (
            <div key={i} style={{ marginBottom: 14 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 5, fontSize: 13 }}>
                <span>{h.block}</span>
                <span style={{ color: 'var(--gold)', fontWeight: 600 }}>{h.occupied}/{h.total} rooms</span>
              </div>
              <div className="bar-track" style={{ height: 12 }}>
                <div className="bar-fill" style={{ width: `${(h.occupied / h.total) * 100}%` }} />
              </div>
            </div>
          ))}

          <div style={{ marginTop: 20 }}>
            <h2 style={{ fontSize: 14, marginBottom: 10 }}>Transport Usage</h2>
            <BarChart
              data={[
                { label: 'Route R-01', value: 28, pct: 90 },
                { label: 'Route R-02', value: 22, pct: 71 },
                { label: 'Route R-03', value: 19, pct: 61 },
                { label: 'Route R-04', value: 31, pct: 100 },
              ]}
              labelWidth={100}
            />
          </div>
        </div>
      </div>
    </section>
  );
}
