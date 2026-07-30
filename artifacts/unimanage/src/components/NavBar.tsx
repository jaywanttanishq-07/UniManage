import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard, Users, GraduationCap, BookOpen, Building2,
  CalendarDays, ClipboardList, BarChart3, CreditCard, Library,
  BedDouble, Bus, Bell, FileText, Settings, CalendarCheck, Award
} from 'lucide-react';

const sections = [
  {
    label: 'Main',
    links: [
      { to: '/', label: 'Dashboard', Icon: LayoutDashboard, end: true },
    ],
  },
  {
    label: 'Academics',
    links: [
      { to: '/students',    label: 'Students',    Icon: GraduationCap },
      { to: '/teachers',    label: 'Teachers',    Icon: Users },
      { to: '/courses',     label: 'Courses',     Icon: BookOpen },
      { to: '/departments', label: 'Departments', Icon: Building2 },
      { to: '/timetable',   label: 'Timetable',   Icon: CalendarDays },
      { to: '/attendance',  label: 'Attendance',  Icon: CalendarCheck },
    ],
  },
  {
    label: 'Examinations',
    links: [
      { to: '/exams',   label: 'Exams',   Icon: ClipboardList },
      { to: '/results', label: 'Results', Icon: BarChart3 },
    ],
  },
  {
    label: 'Administration',
    links: [
      { to: '/fees',      label: 'Fees',      Icon: CreditCard },
      { to: '/library',   label: 'Library',   Icon: Library },
      { to: '/hostel',    label: 'Hostel',    Icon: BedDouble },
      { to: '/transport', label: 'Transport', Icon: Bus },
      { to: '/notices',     label: 'Notices',     Icon: Bell },
      { to: '/scholarship', label: 'Scholarship', Icon: Award },
      { to: '/reports',     label: 'Reports',     Icon: FileText },
      { to: '/settings',    label: 'Settings',    Icon: Settings },
    ],
  },
];

export default function NavBar() {
  return (
    <aside className="sidebar">
      <div className="sidebar-brand">
        <div className="logo-mark" aria-hidden="true">UM</div>
        <div>
          <div className="brand-title">UniManage</div>
          <div className="brand-sub">University System</div>
        </div>
      </div>

      <nav className="sidebar-nav" aria-label="Main">
        {sections.map(({ label, links }) => (
          <div key={label}>
            <div className="sidebar-section-label">{label}</div>
            {links.map(({ to, label: lbl, Icon, end }) => (
              <NavLink
                key={to}
                to={to}
                end={end}
                className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}
              >
                <Icon size={16} />
                <span>{lbl}</span>
              </NavLink>
            ))}
          </div>
        ))}
      </nav>

      <div className="sidebar-footer">© {new Date().getFullYear()} UniManage</div>
    </aside>
  );
}
