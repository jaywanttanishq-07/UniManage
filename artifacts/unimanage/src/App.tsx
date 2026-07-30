import { Routes, Route, useLocation } from 'react-router-dom';
import NavBar          from './components/NavBar';
import MeshBackground  from './components/MeshBackground';
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

export default function App() {
  const location = useLocation();
  return (
    <div className="app-root">
      <MeshBackground />
      <NavBar />
      <div className="main-content">
        <Routes location={location} key={location.pathname}>
          <Route path="/"           element={<Dashboard />} />
          <Route path="/students"   element={<Students />} />
          <Route path="/teachers"   element={<Teachers />} />
          <Route path="/courses"    element={<Courses />} />
          <Route path="/departments" element={<Departments />} />
          <Route path="/timetable"  element={<Timetable />} />
          <Route path="/exams"      element={<Exams />} />
          <Route path="/results"    element={<Results />} />
          <Route path="/fees"       element={<Fees />} />
          <Route path="/library"    element={<LibraryPage />} />
          <Route path="/hostel"     element={<Hostel />} />
          <Route path="/transport"  element={<Transport />} />
          <Route path="/notices"    element={<Notices />} />
          <Route path="/reports"    element={<Reports />} />
          <Route path="/settings"    element={<SettingsPage />} />
          <Route path="/attendance"  element={<Attendance />} />
          <Route path="/scholarship" element={<Scholarship />} />
        </Routes>
      </div>
    </div>
  );
}
