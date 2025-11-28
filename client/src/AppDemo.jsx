import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { DemoProvider, useDemo } from './context/DemoContext';
import NavbarDemo from './components/NavbarDemo';
import HomeDemo from './pages/HomeDemo';
import StudentDashboardDemo from './pages/StudentDashboardDemo';
import UniversityDashboardDemo from './pages/UniversityDashboardDemo';
import EmployerDashboardDemo from './pages/EmployerDashboardDemo';
import VerifyCredential from './pages/VerifyCredential';
import './App.css';

// Protected Route Component
const ProtectedRoute = ({ children, allowedRoles }) => {
  const { isAuthenticated, user, loading } = useDemo();

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  if (!isAuthenticated) {
    return <Navigate to="/" />;
  }

  if (allowedRoles && !allowedRoles.includes(user?.role)) {
    return <Navigate to="/" />;
  }

  return children;
};

function AppRoutes() {
  const { isAuthenticated, user } = useDemo();

  return (
    <Router>
      <div className="App">
        <NavbarDemo />
        <main className="main-content">
          <Routes>
            <Route path="/" element={<HomeDemo />} />
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  {user?.role === 'student' && <StudentDashboardDemo />}
                  {user?.role === 'university' && <UniversityDashboardDemo />}
                  {user?.role === 'employer' && <EmployerDashboardDemo />}
                </ProtectedRoute>
              }
            />
            <Route path="/verify/:hash" element={<VerifyCredential />} />
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

function AppDemo() {
  return (
    <DemoProvider>
      <AppRoutes />
    </DemoProvider>
  );
}

export default AppDemo;
