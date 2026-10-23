import { Routes, Route, useLocation, useNavigate, Navigate } from 'react-router-dom';
import { ThemeProvider } from './contexts/ThemeContext';
import { AuthProvider, canAccessRoute, isTeacherAreaRoute, useAuth } from './contexts/AuthContext';
import NavBar          from './components/NavBar';
import MeshBackground  from './components/MeshBackground';
import LoginPage    from './pages/LoginPage';
import Home         from './pages/Home';
import AboutUs      from './pages/AboutUs';
import Contact      from './pages/Contact';
import Dashboard    from './pages/Dashboard';
import Students     from './pages/Students';
import Teachers     from './pages/Teachers';
import Courses      from './pages/Courses';
import Departments  from './pages/Departments';
import Timetable    from './pages/Timetable';
import Exams        from './pages/Exams';
import Results      from './pages/Results';
import Fees         from './pages/Fees';
import LibraryPage  from './pages/Library';
import Hostel       from './pages/Hostel';
import Transport    from './pages/Transport';
import Notices      from './pages/Notices';
import Reports      from './pages/Reports';
import SettingsPage  from './pages/SettingsPage';
import Attendance   from './pages/Attendance';
import Scholarship  from './pages/Scholarship';
import TeacherWorkspace from './pages/TeacherWorkspace';

const PUBLIC_ROUTES = ['/', '/about', '/contact'];

function AppInner() {
  const location   = useLocation();
  const navigate = useNavigate();
  const { role } = useAuth();
  const isPublic   = PUBLIC_ROUTES.includes(location.pathname);

  if (location.pathname === '/login') {
    return role
      ? <Navigate to={role === 'teacher' ? '/teacher-workspace' : '/dashboard'} replace />
      : <LoginPage />;
  }

  if (isPublic) {
    return (
      <div className="app-root app-public">
        <MeshBackground />
        <Routes location={location} key={location.pathname}>
          <Route path="/"        element={<Home />} />
          <Route path="/about"   element={<AboutUs />} />
          <Route path="/contact" element={<Contact />} />
        </Routes>
      </div>
    );
  }

  if (!canAccessRoute(role, location.pathname)) {
    return role ? (
      <div className="login-root">
        <section className="login-card">
          <h1 className="login-title">Access restricted</h1>
          <p className="muted">
            {isTeacherAreaRoute(location.pathname)
              ? 'This workspace is only available to teachers and faculty.'
              : 'This section is not available to teacher accounts.'}
          </p>
          <button className="btn-gold" onClick={() => navigate(role === 'teacher' ? '/teacher-workspace' : '/dashboard')}>
            {role === 'teacher' ? 'Go to Teacher Workspace' : 'Back to dashboard'}
          </button>
        </section>
      </div>
    ) : (
      <LoginPage />
    );
  }

  return (
    <div className="app-root">
      <MeshBackground />
      <NavBar />
      <div className="main-content">
        <Routes location={location} key={location.pathname}>
          <Route path="/dashboard"   element={<Dashboard />} />
          <Route path="/students"    element={<Students />} />
          <Route path="/teachers"    element={<Teachers />} />
          <Route path="/courses"     element={<Courses />} />
          <Route path="/departments" element={<Departments />} />
          <Route path="/timetable"   element={<Timetable />} />
          <Route path="/exams"       element={<Exams />} />
          <Route path="/results"     element={<Results />} />
          <Route path="/fees"        element={<Fees />} />
          <Route path="/library"     element={<LibraryPage />} />
          <Route path="/hostel"      element={<Hostel />} />
          <Route path="/transport"   element={<Transport />} />
          <Route path="/notices"     element={<Notices />} />
          <Route path="/reports"     element={<Reports />} />
          <Route path="/settings"    element={<SettingsPage />} />
          <Route path="/attendance"  element={<Attendance />} />
          <Route path="/scholarship" element={<Scholarship />} />
          <Route path="/teacher-workspace" element={<TeacherWorkspace />} />
          <Route path="/teacher/courses" element={<Courses />} />
          <Route path="/teacher/departments" element={<Departments />} />
          <Route path="/teacher/attendance" element={<Attendance />} />
          <Route path="/teacher/exams" element={<Exams />} />
          <Route path="/teacher/results" element={<Results />} />
          <Route path="/teacher/fees" element={<Fees />} />
          <Route path="/teacher/library" element={<LibraryPage />} />
          <Route path="/teacher/hostel" element={<Hostel />} />
          <Route path="/teacher/transport" element={<Transport />} />
          <Route path="/teacher/notices" element={<Notices audience="teachers" />} />
          <Route path="/teacher/scholarship" element={<Scholarship />} />
          <Route path="/teacher/reports" element={<Reports />} />
        </Routes>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <AppInner />
      </AuthProvider>
    </ThemeProvider>
  );
}
