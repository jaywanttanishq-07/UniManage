export type AttStatus = 'Present' | 'Absent' | 'Late';

export interface DaySummary {
  date: string;   // 'YYYY-MM-DD'
  day: string;    // 'Monday'
  studentPresent: number; studentAbsent: number; studentLate: number;
  teacherPresent: number; teacherAbsent: number; teacherLate: number;
}

// 12 school days leading up to today (Jul 29 2026)
export const SCHOOL_DAYS: { date: string; day: string }[] = [
  { date: '2026-07-14', day: 'Tuesday' },
  { date: '2026-07-15', day: 'Wednesday' },
  { date: '2026-07-16', day: 'Thursday' },
  { date: '2026-07-17', day: 'Friday' },
  { date: '2026-07-20', day: 'Monday' },
  { date: '2026-07-21', day: 'Tuesday' },
  { date: '2026-07-22', day: 'Wednesday' },
  { date: '2026-07-23', day: 'Thursday' },
  { date: '2026-07-24', day: 'Friday' },
  { date: '2026-07-27', day: 'Monday' },
  { date: '2026-07-28', day: 'Tuesday' },
  { date: '2026-07-29', day: 'Wednesday' },
];

// studentId -> date -> status
export const STUDENT_ATT: Record<number, Record<string, AttStatus>> = {
  1001: { '2026-07-14':'Present','2026-07-15':'Present','2026-07-16':'Present','2026-07-17':'Present','2026-07-20':'Present','2026-07-21':'Present','2026-07-22':'Present','2026-07-23':'Present','2026-07-24':'Present','2026-07-27':'Present','2026-07-28':'Present','2026-07-29':'Present' },
  1002: { '2026-07-14':'Present','2026-07-15':'Present','2026-07-16':'Present','2026-07-17':'Absent', '2026-07-20':'Present','2026-07-21':'Present','2026-07-22':'Present','2026-07-23':'Present','2026-07-24':'Present','2026-07-27':'Present','2026-07-28':'Present','2026-07-29':'Present' },
  1003: { '2026-07-14':'Present','2026-07-15':'Present','2026-07-16':'Absent', '2026-07-17':'Present','2026-07-20':'Present','2026-07-21':'Present','2026-07-22':'Present','2026-07-23':'Present','2026-07-24':'Absent', '2026-07-27':'Present','2026-07-28':'Present','2026-07-29':'Present' },
  1004: { '2026-07-14':'Present','2026-07-15':'Absent', '2026-07-16':'Present','2026-07-17':'Present','2026-07-20':'Present','2026-07-21':'Present','2026-07-22':'Absent', '2026-07-23':'Present','2026-07-24':'Present','2026-07-27':'Present','2026-07-28':'Present','2026-07-29':'Late'    },
  1005: { '2026-07-14':'Absent', '2026-07-15':'Present','2026-07-16':'Present','2026-07-17':'Present','2026-07-20':'Present','2026-07-21':'Present','2026-07-22':'Present','2026-07-23':'Absent', '2026-07-24':'Present','2026-07-27':'Present','2026-07-28':'Present','2026-07-29':'Present' },
  1006: { '2026-07-14':'Present','2026-07-15':'Present','2026-07-16':'Present','2026-07-17':'Absent', '2026-07-20':'Present','2026-07-21':'Present','2026-07-22':'Present','2026-07-23':'Present','2026-07-24':'Present','2026-07-27':'Absent', '2026-07-28':'Present','2026-07-29':'Present' },
  1007: { '2026-07-14':'Present','2026-07-15':'Present','2026-07-16':'Present','2026-07-17':'Present','2026-07-20':'Present','2026-07-21':'Late',   '2026-07-22':'Present','2026-07-23':'Present','2026-07-24':'Present','2026-07-27':'Present','2026-07-28':'Present','2026-07-29':'Present' },
  1008: { '2026-07-14':'Absent', '2026-07-15':'Present','2026-07-16':'Absent', '2026-07-17':'Present','2026-07-20':'Present','2026-07-21':'Absent', '2026-07-22':'Present','2026-07-23':'Present','2026-07-24':'Present','2026-07-27':'Present','2026-07-28':'Absent', '2026-07-29':'Present' },
};

// teacherId -> date -> status
export const TEACHER_ATT: Record<number, Record<string, AttStatus>> = {
  201: { '2026-07-14':'Present','2026-07-15':'Present','2026-07-16':'Present','2026-07-17':'Present','2026-07-20':'Present','2026-07-21':'Present','2026-07-22':'Present','2026-07-23':'Present','2026-07-24':'Present','2026-07-27':'Present','2026-07-28':'Present','2026-07-29':'Present' },
  202: { '2026-07-14':'Present','2026-07-15':'Present','2026-07-16':'Present','2026-07-17':'Present','2026-07-20':'Present','2026-07-21':'Absent', '2026-07-22':'Present','2026-07-23':'Present','2026-07-24':'Present','2026-07-27':'Present','2026-07-28':'Present','2026-07-29':'Present' },
  203: { '2026-07-14':'Present','2026-07-15':'Present','2026-07-16':'Present','2026-07-17':'Present','2026-07-20':'Present','2026-07-21':'Present','2026-07-22':'Present','2026-07-23':'Present','2026-07-24':'Present','2026-07-27':'Present','2026-07-28':'Present','2026-07-29':'Present' },
  204: { '2026-07-14':'Absent', '2026-07-15':'Present','2026-07-16':'Present','2026-07-17':'Present','2026-07-20':'Present','2026-07-21':'Present','2026-07-22':'Absent', '2026-07-23':'Present','2026-07-24':'Present','2026-07-27':'Present','2026-07-28':'Present','2026-07-29':'Present' },
  205: { '2026-07-14':'Present','2026-07-15':'Present','2026-07-16':'Present','2026-07-17':'Present','2026-07-20':'Present','2026-07-21':'Present','2026-07-22':'Present','2026-07-23':'Present','2026-07-24':'Present','2026-07-27':'Late',   '2026-07-28':'Present','2026-07-29':'Present' },
  206: { '2026-07-14':'Present','2026-07-15':'Present','2026-07-16':'Present','2026-07-17':'Present','2026-07-20':'Present','2026-07-21':'Present','2026-07-22':'Present','2026-07-23':'Absent', '2026-07-24':'Present','2026-07-27':'Present','2026-07-28':'Present','2026-07-29':'Present' },
};

/** Attendance % for one person (late counts as present) */
export function attPct(records: Record<string, AttStatus>): number {
  const total = SCHOOL_DAYS.length;
  const present = SCHOOL_DAYS.filter(d => {
    const s = records[d.date];
    return s === 'Present' || s === 'Late';
  }).length;
  return Math.round((present / total) * 100);
}

/** Badge class for a percentage */
export function attBadge(pct: number) {
  if (pct >= 90) return 'badge-green';
  if (pct >= 75) return 'badge-yellow';
  return 'badge-red';
}

/** Badge class for a single status */
export function statusBadge(s: AttStatus) {
  if (s === 'Present') return 'badge-green';
  if (s === 'Late')    return 'badge-yellow';
  return 'badge-red';
}

/** Build day summaries for all school days */
export function buildSummaries(
  studentAtt: Record<number, Record<string, AttStatus>>,
  teacherAtt:  Record<number, Record<string, AttStatus>>,
): DaySummary[] {
  return SCHOOL_DAYS.map(({ date, day }) => {
    const sVals = Object.values(studentAtt).map(r => r[date] ?? 'Absent');
    const tVals = Object.values(teacherAtt).map(r => r[date] ?? 'Absent');
    return {
      date, day,
      studentPresent: sVals.filter(v => v === 'Present').length,
      studentAbsent:  sVals.filter(v => v === 'Absent').length,
      studentLate:    sVals.filter(v => v === 'Late').length,
      teacherPresent: tVals.filter(v => v === 'Present').length,
      teacherAbsent:  tVals.filter(v => v === 'Absent').length,
      teacherLate:    tVals.filter(v => v === 'Late').length,
    };
  });
}
