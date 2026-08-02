import { Routes, Route, useLocation, Navigate } from 'react-router-dom';
import { ThemeProvider } from './contexts/ThemeContext';
import { AuthProvider, useAuth } from './contexts/AuthContext';
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

// Pages that show without sidebar (public marketing pages)
const PUBLIC_ROUTES = ['/', '/about', '/contact'];

function AppInner() {
  const location   = useLocation();
  const { isLoggedIn } = useAuth();
  const isPublic   = PUBLIC_ROUTES.includes(location.pathname);

  // ── Not logged in → show login screen for every app route ────────────────
  if (!isLoggedIn && !isPublic) {
    return <LoginPage />;
  }

  // ── Public marketing pages (no sidebar, no auth required) ────────────────
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

  // ── App routes (authenticated, sidebar layout) ────────────────────────────
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
          {/* Redirect bare /login back to dashboard if already logged in */}
          <Route path="/login" element={<Navigate to="/dashboard" replace />} />
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
