import { Link } from 'react-router-dom';
import {
  ArrowRight,
  Award,
  BarChart3,
  Bell,
  BookOpen,
  Building2,
  Bus,
  CalendarCheck,
  ClipboardList,
  CreditCard,
  GraduationCap,
  Library,
  BedDouble,
  type LucideIcon,
} from 'lucide-react';
import './TeacherWorkspace.css';

type WorkspaceModule = {
  title: string;
  description: string;
  to: string;
  Icon: LucideIcon;
};

type WorkspaceGroup = {
  title: string;
  note: string;
  modules: WorkspaceModule[];
};

const groups: WorkspaceGroup[] = [
  {
    title: 'Teaching & learning',
    note: 'Your academic workspace',
    modules: [
      {
        title: 'Courses',
        description: 'Explore course information and teaching resources.',
        to: '/teacher/courses',
        Icon: BookOpen,
      },
      {
        title: 'Departments',
        description: 'Find department details and academic structure.',
        to: '/teacher/departments',
        Icon: Building2,
      },
      {
        title: 'Attendance',
        description: 'Review class attendance records.',
        to: '/teacher/attendance',
        Icon: CalendarCheck,
      },
    ],
  },
  {
    title: 'Assessment',
    note: 'Exams, results & reporting',
    modules: [
      {
        title: 'Exams',
        description: 'View examination schedules and information.',
        to: '/teacher/exams',
        Icon: ClipboardList,
      },
      {
        title: 'Results',
        description: 'Access student result information.',
        to: '/teacher/results',
        Icon: BarChart3,
      },
      {
        title: 'Reports',
        description: 'Open academic reports and summaries.',
        to: '/teacher/reports',
        Icon: BarChart3,
      },
    ],
  },
  {
    title: 'Campus services',
    note: 'Useful university resources',
    modules: [
      {
        title: 'Fees',
        description: 'Access fee information and records.',
        to: '/teacher/fees',
        Icon: CreditCard,
      },
      {
        title: 'Library',
        description: 'Browse library services and resources.',
        to: '/teacher/library',
        Icon: Library,
      },
      {
        title: 'Hostel',
        description: 'View campus hostel information.',
        to: '/teacher/hostel',
        Icon: BedDouble,
      },
      {
        title: 'Transport',
        description: 'Check university transport details.',
        to: '/teacher/transport',
        Icon: Bus,
      },
    ],
  },
  {
    title: 'Updates & opportunities',
    note: 'Stay informed across campus',
    modules: [
      {
        title: 'Notices',
        description: 'Read announcements from your university.',
        to: '/teacher/notices',
        Icon: Bell,
      },
      {
        title: 'Scholarship',
        description: 'Explore scholarship information and updates.',
        to: '/teacher/scholarship',
        Icon: Award,
      },
    ],
  },
];

export default function TeacherWorkspace() {
  return (
    <main className="teacher-workspace">
      <header className="tw-header">
        <div className="tw-heading">
          <div className="tw-eyebrow">
            <span className="tw-eyebrow-rule" aria-hidden="true" />
            UNIMANAGE <span className="tw-eyebrow-separator">/</span> FACULTY
          </div>
          <h1>Good to have you here.</h1>
          <p>Your university tools, gathered in one place.</p>
        </div>
        <div className="tw-header-mark" aria-hidden="true">
          <div className="tw-mark-orbit tw-mark-orbit-outer" />
          <div className="tw-mark-orbit tw-mark-orbit-inner" />
          <div className="tw-mark-core">
            <GraduationCap size={29} strokeWidth={1.55} />
          </div>
          <span className="tw-mark-caption">FACULTY<br />WORKSPACE</span>
        </div>
      </header>

      <section className="tw-intro-band" aria-label="Workspace introduction">
        <div className="tw-intro-icon" aria-hidden="true">
          <BookOpen size={18} strokeWidth={1.8} />
        </div>
        <div>
          <span className="tw-intro-label">A clear path through campus</span>
          <p>Choose a workspace below to continue where your day takes you.</p>
        </div>
        <span className="tw-intro-index" aria-hidden="true">01 — 04</span>
      </section>

      <div className="tw-groups">
        {groups.map((group, groupIndex) => (
          <section className="tw-group" key={group.title}>
            <div className="tw-group-heading">
              <div className="tw-group-title-wrap">
                <span className="tw-group-number">0{groupIndex + 1}</span>
                <div>
                  <h2>{group.title}</h2>
                  <p>{group.note}</p>
                </div>
              </div>
              <span className="tw-group-count">
                {String(group.modules.length).padStart(2, '0')} WORKSPACES
              </span>
            </div>
            <div className="tw-module-grid">
              {group.modules.map(({ title, description, to, Icon }, moduleIndex) => (
                <Link
                  className="tw-module"
                  to={to}
                  key={to}
                  data-testid={`link-teacher-module-${title.toLowerCase().replace(/\s+/g, '-')}`}
                  style={{ animationDelay: `${groupIndex * 75 + moduleIndex * 45}ms` }}
                >
                  <span className="tw-module-icon" aria-hidden="true">
                    <Icon size={19} strokeWidth={1.7} />
                  </span>
                  <span className="tw-module-copy">
                    <span className="tw-module-title">{title}</span>
                    <span className="tw-module-description">{description}</span>
                  </span>
                  <span className="tw-module-arrow" aria-hidden="true">
                    <ArrowRight size={16} strokeWidth={1.8} />
                  </span>
                </Link>
              ))}
            </div>
          </section>
        ))}
      </div>

      <footer className="tw-footer">
        <span className="tw-footer-rule" aria-hidden="true" />
        <p>One university. Every resource you need.</p>
        <span className="tw-footer-brand">UniManage <span>•</span> Faculty</span>
      </footer>
    </main>
  );
}
