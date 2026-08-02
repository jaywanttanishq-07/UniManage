import { NavLink, useNavigate } from 'react-router-dom';
import { Sun, Moon, LogOut } from 'lucide-react';
import {
  LayoutDashboard, Users, GraduationCap, BookOpen, Building2,
  CalendarDays, ClipboardList, BarChart3, CreditCard, Library,
  BedDouble, Bus, Bell, FileText, Settings, CalendarCheck, Award,
  Home,
} from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';
import { useAuth  } from '../contexts/AuthContext';

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
  const { logout, adminId }    = useAuth();
  const navigate = useNavigate();

  function handleLogout() {
    logout();
    navigate('/dashboard');   // will hit the auth guard and show LoginPage
  }

  return (
    <aside className="sidebar">
      {/* Brand */}
      <div className="sidebar-brand">
        <div className="logo-mark" aria-hidden="true">UM</div>
        <div>
          <div className="brand-title">UniManage</div>
          <div className="brand-sub">University System</div>
        </div>
      </div>

      {/* Scrollable nav */}
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

      {/* Footer */}
      <div className="sidebar-footer">
        {/* Logged-in admin badge */}
        <div className="sidebar-admin-badge">
          <span className="sidebar-admin-dot" />
          <span className="sidebar-admin-id">{adminId}</span>
        </div>

        {/* Theme toggle */}
        <button
          className="theme-toggle-btn"
          onClick={toggleTheme}
          title={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
        >
          {theme === 'dark' ? <Sun size={15} /> : <Moon size={15} />}
          <span className="theme-toggle-label">{theme === 'dark' ? 'Light Mode' : 'Dark Mode'}</span>
        </button>

        {/* Logout button */}
        <button
          className="logout-btn"
          onClick={handleLogout}
          title="Sign out"
        >
          <LogOut size={15} />
          <span className="theme-toggle-label">Sign Out</span>
        </button>
      </div>
    </aside>
  );
}
