import { Link } from 'react-router-dom';
import { useDemo } from '../context/DemoContext';
import './Navbar.css';

const NavbarDemo = () => {
  const { isAuthenticated, user, logout } = useDemo();

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/" className="navbar-logo">
          🔐 DecentralID <span className="demo-tag">DEMO</span>
        </Link>

        <div className="navbar-menu">
          {isAuthenticated ? (
            <>
              <Link to="/dashboard" className="navbar-item">
                Dashboard
              </Link>
              <div className="navbar-user">
                <span className="user-name">{user?.name}</span>
                <span className="user-role">{user?.role}</span>
              </div>
              <button onClick={logout} className="btn btn-outline btn-sm">
                Switch Role
              </button>
            </>
          ) : (
            <>
              <span className="navbar-item demo-notice">
                Select a role to explore
              </span>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default NavbarDemo;
