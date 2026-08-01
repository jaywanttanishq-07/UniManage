import { NavLink } from 'react-router-dom';
import { Sun, Moon } from 'lucide-react';
import {
  LayoutDashboard, Users, GraduationCap, BookOpen, Building2,
  CalendarDays, ClipboardList, BarChart3, CreditCard, Library,
  BedDouble, Bus, Bell, FileText, Settings, CalendarCheck, Award,
  Home,
} from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';

type NavLinkDef = {
  to: string;
  label: string;
  Icon: React.ComponentType<{ size?: number }>;
  end?: boolean;
};

type NavSection = {
  label: string;
  links: NavLinkDef[];
};

const sections: NavSection[] = [
  {
    label: 'Site',
    links: [
      { to: '/', label: 'Home', Icon: Home, end: true },
    ],
  },
  {
    label: 'Main',
    links: [
      { to: '/dashboard', label: 'Dashboard', Icon: LayoutDashboard, end: true },
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
      { to: '/fees',        label: 'Fees',        Icon: CreditCard },
      { to: '/library',     label: 'Library',     Icon: Library },
      { to: '/hostel',      label: 'Hostel',      Icon: BedDouble },
      { to: '/transport',   label: 'Transport',   Icon: Bus },
      { to: '/notices',     label: 'Notices',     Icon: Bell },
      { to: '/scholarship', label: 'Scholarship', Icon: Award },
      { to: '/reports',     label: 'Reports',     Icon: FileText },
      { to: '/settings',    label: 'Settings',    Icon: Settings },
    ],
  },
];

export default function NavBar() {
  const { theme, toggleTheme } = useTheme();

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

      <div className="sidebar-footer">
        <button
          className="theme-toggle-btn"
          onClick={toggleTheme}
          title={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
          style={{ marginBottom: 8 }}
        >
          {theme === 'dark' ? <Sun size={15} /> : <Moon size={15} />}
          <span className="theme-toggle-label">{theme === 'dark' ? 'Light Mode' : 'Dark Mode'}</span>
        </button>
        <div>© {new Date().getFullYear()} UniManage</div>
      </div>
    </aside>
  );
}
