import { useState } from 'react';
import {
  SCHOOL_DAYS, STUDENT_ATT, TEACHER_ATT,
  AttStatus, attPct, attBadge, statusBadge, buildSummaries,
} from '../data/attendance';

const STUDENT_INFO: Record<number, { name: string; program: string }> = {
  1001: { name: 'Alice Johnson', program: 'Computer Science' },
  1002: { name: 'Ben Patel',     program: 'Business' },
  1003: { name: 'Carla Gomez',   program: 'Biology' },
  1004: { name: 'Daniel Kim',    program: 'Mechanical Eng.' },
  1005: { name: 'Eva Singh',     program: 'Mathematics' },
  1006: { name: 'Frank Lee',     program: 'Physics' },
  1007: { name: 'Grace Wu',      program: 'Chemistry' },
  1008: { name: 'Henry Brown',   program: 'Computer Science' },
};
const TEACHER_INFO: Record<number, { name: string; dept: string }> = {
  201: { name: 'Dr. Sarah Mitchell', dept: 'Computer Science' },
  202: { name: 'Prof. James Carter', dept: 'Mechanical Eng.' },
  203: { name: 'Dr. Priya Sharma',   dept: 'Chemistry' },
  204: { name: 'Prof. Alan Wright',  dept: 'Business' },
  205: { name: 'Dr. Li Wei',         dept: 'Mathematics' },
  206: { name: 'Prof. Nina Roberts', dept: 'Biology' },
};

const TODAY = '2026-07-29';

export default function Attendance() {
  const [tab, setTab]         = useState<'daily' | 'weekly'>('daily');
  const [dayTab, setDayTab]   = useState<'students' | 'teachers'>('students');
  const [selDate, setSelDate] = useState(TODAY);

  // local mutable state so user can mark attendance
  const [studentAtt, setStudentAtt] = useState<Record<number, Record<string, AttStatus>>>(() =>
    JSON.parse(JSON.stringify(STUDENT_ATT))
  );
  const [teacherAtt, setTeacherAtt] = useState<Record<number, Record<string, AttStatus>>>(() =>
    JSON.parse(JSON.stringify(TEACHER_ATT))
  );

  function markStudent(id: number, date: string, status: AttStatus) {
    setStudentAtt(prev => ({ ...prev, [id]: { ...prev[id], [date]: status } }));
  }
  function markTeacher(id: number, date: string, status: AttStatus) {
    setTeacherAtt(prev => ({ ...prev, [id]: { ...prev[id], [date]: status } }));
  }

  const summaries = buildSummaries(studentAtt, teacherAtt);
  const todaySum  = summaries.find(s => s.date === TODAY);
  const totalS    = Object.keys(STUDENT_INFO).length;
  const totalT    = Object.keys(TEACHER_INFO).length;

  const selDayInfo = SCHOOL_DAYS.find(d => d.date === selDate);
  const isSchoolDay = !!selDayInfo;

  // overall averages
  const avgSPct = Math.round(Object.keys(studentAtt).reduce((s, id) => s + attPct(studentAtt[+id]), 0) / totalS);
  const avgTPct = Math.round(Object.keys(teacherAtt).reduce((s, id) => s + attPct(teacherAtt[+id]), 0) / totalT);

  return (
    <section className="container">
      <header className="page-header">
        <div>
          <h1>Attendance</h1>
          <p className="muted">Daily and weekly attendance records for students and faculty.</p>
        </div>
      </header>

      {/* Summary stats */}
      <div className="grid-4" style={{ marginBottom: 24 }}>
        <div className="stat-card">
          <div className="stat-icon">📅</div>
          <div>
            <div className="stat-value">{todaySum ? todaySum.studentPresent + todaySum.studentLate : '—'}/{totalS}</div>
            <div className="stat-label">Students Today</div>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">👨‍🏫</div>
          <div>
            <div className="stat-value">{todaySum ? todaySum.teacherPresent + todaySum.teacherLate : '—'}/{totalT}</div>
            <div className="stat-label">Teachers Today</div>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">🎓</div>
          <div>
            <div className="stat-value">{avgSPct}%</div>
            <div className="stat-label">Avg Student Attendance</div>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">📊</div>
          <div>
            <div className="stat-value">{avgTPct}%</div>
            <div className="stat-label">Avg Teacher Attendance</div>
          </div>
        </div>
      </div>

      {/* Main tabs */}
      <div className="tab-bar" style={{ marginBottom: 24 }}>
        <button className={`tab-btn${tab === 'daily'  ? ' active' : ''}`} onClick={() => setTab('daily')}>📋 Daily View</button>
        <button className={`tab-btn${tab === 'weekly' ? ' active' : ''}`} onClick={() => setTab('weekly')}>📆 Weekly Report</button>
      </div>

      {/* ── DAILY VIEW ── */}
      {tab === 'daily' && (
        <div>
          {/* Date picker */}
          <div className="att-date-bar">
            <div className="att-date-pick">
              <label className="att-date-label">Select Date</label>
              <input
                type="date"
                className="att-date-input"
                value={selDate}
                min="2026-07-14"
                max="2026-07-29"
                onChange={e => setSelDate(e.target.value)}
              />
            </div>
            {selDayInfo && (
              <div className="att-date-badge">
                <span className="att-day-name">{selDayInfo.day}</span>
                <span className="att-day-date">{new Date(selDate + 'T00:00:00').toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}</span>
              </div>
            )}
            {/* Quick day chips */}
            <div className="att-day-chips">
              {SCHOOL_DAYS.slice(-7).map(d => (
                <button
                  key={d.date}
                  className={`att-day-chip${selDate === d.date ? ' active' : ''}`}
                  onClick={() => setSelDate(d.date)}
                  title={d.date}
                >
                  <span>{d.day.slice(0, 3)}</span>
                  <span>{d.date.slice(8)}</span>
                </button>
              ))}
            </div>
          </div>

          {!isSchoolDay ? (
            <div className="att-no-day">
              <div style={{ fontSize: 40, marginBottom: 10 }}>🚫</div>
              <p>No school on this date. Please select a school day.</p>
            </div>
          ) : (
            <>
              {/* Students / Teachers sub-tabs */}
              <div className="tab-bar" style={{ marginBottom: 16 }}>
                <button className={`tab-btn${dayTab === 'students' ? ' active' : ''}`} onClick={() => setDayTab('students')}>🎓 Students</button>
                <button className={`tab-btn${dayTab === 'teachers' ? ' active' : ''}`} onClick={() => setDayTab('teachers')}>👨‍🏫 Teachers</button>
              </div>

              {/* Students table */}
              {dayTab === 'students' && (
                <div className="table-card">
                  <table className="uni-table">
                    <thead>
                      <tr>
                        <th>ID</th><th>Name</th><th>Program</th>
                        <th>Status</th><th>Mark Attendance</th>
                      </tr>
                    </thead>
                    <tbody>
                      {Object.entries(STUDENT_INFO).map(([idStr, info]) => {
                        const id  = +idStr;
                        const cur = studentAtt[id]?.[selDate] ?? 'Absent';
                        return (
                          <tr key={id}>
                            <td className="muted">{id}</td>
                            <td style={{ fontWeight: 600 }}>{info.name}</td>
                            <td>{info.program}</td>
                            <td><span className={`badge ${statusBadge(cur)}`}>{cur}</span></td>
                            <td>
                              <div className="att-mark-btns">
                                {(['Present','Late','Absent'] as AttStatus[]).map(st => (
                                  <button
                                    key={st}
                                    className={`att-mark-btn${cur === st ? ` att-mark-btn--${st.toLowerCase()}` : ''}`}
                                    onClick={() => markStudent(id, selDate, st)}
                                  >{st}</button>
                                ))}
                              </div>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              )}

              {/* Teachers table */}
              {dayTab === 'teachers' && (
                <div className="table-card">
                  <table className="uni-table">
                    <thead>
                      <tr>
                        <th>ID</th><th>Name</th><th>Department</th>
                        <th>Status</th><th>Mark Attendance</th>
                      </tr>
                    </thead>
                    <tbody>
                      {Object.entries(TEACHER_INFO).map(([idStr, info]) => {
                        const id  = +idStr;
                        const cur = teacherAtt[id]?.[selDate] ?? 'Absent';
                        return (
                          <tr key={id}>
                            <td className="muted">{id}</td>
                            <td style={{ fontWeight: 600 }}>{info.name}</td>
                            <td>{info.dept}</td>
                            <td><span className={`badge ${statusBadge(cur)}`}>{cur}</span></td>
                            <td>
                              <div className="att-mark-btns">
                                {(['Present','Late','Absent'] as AttStatus[]).map(st => (
                                  <button
                                    key={st}
                                    className={`att-mark-btn${cur === st ? ` att-mark-btn--${st.toLowerCase()}` : ''}`}
                                    onClick={() => markTeacher(id, selDate, st)}
                                  >{st}</button>
                                ))}
                              </div>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              )}
            </>
          )}
        </div>
      )}

      {/* ── WEEKLY REPORT ── */}
      {tab === 'weekly' && (
        <div>
          {/* Per-day summary table */}
          <div className="table-card" style={{ marginBottom: 28 }}>
            <table className="uni-table">
              <thead>
                <tr>
                  <th>Date</th><th>Day</th>
                  <th>Students Present</th><th>Students Absent</th><th>Students Late</th>
                  <th>Teachers Present</th><th>Teachers Absent</th>
                  <th>Attendance %</th>
                </tr>
              </thead>
              <tbody>
                {summaries.map(s => {
                  const sTotal = totalS;
                  const tTotal = totalT;
                  const overallPct = Math.round(
                    ((s.studentPresent + s.studentLate + s.teacherPresent + s.teacherLate) /
                      (sTotal + tTotal)) * 100
                  );
                  const isToday = s.date === TODAY;
                  return (
                    <tr key={s.date} style={isToday ? { background: 'rgba(212,175,55,0.05)' } : {}}>
                      <td style={{ fontWeight: isToday ? 700 : 400, color: isToday ? 'var(--gold)' : undefined }}>
                        {new Date(s.date + 'T00:00:00').toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })}
                        {isToday && <span style={{ fontSize: 10, marginLeft: 6, color: 'var(--gold)', opacity: .7 }}>TODAY</span>}
                      </td>
                      <td className="muted">{s.day}</td>
                      <td>
                        <div className="att-cell-bar">
                          <div className="att-mini-bar" style={{ width: `${Math.round((s.studentPresent / sTotal) * 100)}%`, background: 'var(--gold)' }} />
                          <span>{s.studentPresent}</span>
                        </div>
                      </td>
                      <td><span style={{ color: s.studentAbsent > 2 ? '#ef4444' : 'var(--muted)' }}>{s.studentAbsent}</span></td>
                      <td><span style={{ color: s.studentLate > 0 ? '#f59e0b' : 'var(--muted)' }}>{s.studentLate}</span></td>
                      <td>
                        <div className="att-cell-bar">
                          <div className="att-mini-bar" style={{ width: `${Math.round((s.teacherPresent / tTotal) * 100)}%`, background: '#60a5fa' }} />
                          <span>{s.teacherPresent}</span>
                        </div>
                      </td>
                      <td><span style={{ color: s.teacherAbsent > 1 ? '#ef4444' : 'var(--muted)' }}>{s.teacherAbsent}</span></td>
                      <td>
                        <span className={`badge ${overallPct >= 90 ? 'badge-green' : overallPct >= 75 ? 'badge-yellow' : 'badge-red'}`}>
                          {overallPct}%
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Individual attendance cards */}
          <h3 style={{ fontSize: 15, fontWeight: 700, marginBottom: 14, color: '#e6e6e6' }}>Student Attendance Summary</h3>
          <div className="att-person-grid" style={{ marginBottom: 28 }}>
            {Object.entries(STUDENT_INFO).map(([idStr, info]) => {
              const id  = +idStr;
              const pct = attPct(studentAtt[id] ?? {});
              return (
                <div key={id} className="att-person-card">
                  <div className="att-person-avatar">{info.name.charAt(0)}</div>
                  <div className="att-person-info">
                    <div className="att-person-name">{info.name}</div>
                    <div className="att-person-sub">{info.program} · ID {id}</div>
                    <div className="att-person-bar-wrap">
                      <div className="att-person-bar" style={{ width: `${pct}%`, background: pct >= 90 ? 'var(--gold)' : pct >= 75 ? '#f59e0b' : '#ef4444' }} />
                    </div>
                  </div>
                  <span className={`badge ${attBadge(pct)}`}>{pct}%</span>
                </div>
              );
            })}
          </div>

          <h3 style={{ fontSize: 15, fontWeight: 700, marginBottom: 14, color: '#e6e6e6' }}>Teacher Attendance Summary</h3>
          <div className="att-person-grid">
            {Object.entries(TEACHER_INFO).map(([idStr, info]) => {
              const id  = +idStr;
              const pct = attPct(teacherAtt[id] ?? {});
              return (
                <div key={id} className="att-person-card">
                  <div className="att-person-avatar" style={{ background: 'linear-gradient(135deg,#60a5fa,#3b82f6)' }}>{info.name.replace('Dr. ','').replace('Prof. ','').charAt(0)}</div>
                  <div className="att-person-info">
                    <div className="att-person-name">{info.name}</div>
                    <div className="att-person-sub">{info.dept} · ID {id}</div>
                    <div className="att-person-bar-wrap">
                      <div className="att-person-bar" style={{ width: `${pct}%`, background: pct >= 90 ? '#60a5fa' : pct >= 75 ? '#f59e0b' : '#ef4444' }} />
                    </div>
                  </div>
                  <span className={`badge ${attBadge(pct)}`}>{pct}%</span>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </section>
  );
}
