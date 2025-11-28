import { useNavigate } from 'react-router-dom';
import { useDemo } from '../context/DemoContext';
import './Home.css';

const HomeDemo = () => {
  const { isAuthenticated, selectRole } = useDemo();
  const navigate = useNavigate();

  const handleRoleSelect = (roleKey) => {
    const result = selectRole(roleKey);
    if (result.success) {
      navigate('/dashboard');
    }
  };

  if (isAuthenticated) {
    navigate('/dashboard');
    return null;
  }

  return (
    <div className="home">
      <section className="hero">
        <h1 className="hero-title">Decentralized Identity System</h1>
        <p className="hero-subtitle">
          Take control of your digital credentials with blockchain-powered Self-Sovereign Identity
        </p>
        <div className="demo-badge">
          <span>🎭 DEMO MODE - Select a Role to Explore</span>
        </div>
      </section>

      <section className="features">
        <div className="container">
          <h2 className="section-title">Select Your Role</h2>

          <div className="grid grid-3">
            <div className="feature-card role-card" onClick={() => handleRoleSelect('student1')}>
              <div className="feature-icon">🎓</div>
              <h3>Student Dashboard</h3>
              <p className="role-name">John Doe</p>
              <p className="role-org">MIT</p>
              <p>
                View and manage your academic credentials. See degrees and certificates
                issued by your university.
              </p>
              <button className="btn btn-primary">Enter as Student</button>
            </div>

            <div className="feature-card role-card" onClick={() => handleRoleSelect('university1')}>
              <div className="feature-icon">🏛️</div>
              <h3>University Dashboard</h3>
              <p className="role-name">MIT Registrar</p>
              <p className="role-org">Massachusetts Institute of Technology</p>
              <p>
                Issue verifiable credentials to students. Manage and track all issued
                academic certificates.
              </p>
              <button className="btn btn-primary">Enter as University</button>
            </div>

            <div className="feature-card role-card" onClick={() => handleRoleSelect('employer')}>
              <div className="feature-icon">💼</div>
              <h3>Employer Dashboard</h3>
              <p className="role-name">Tech Corp HR</p>
              <p className="role-org">Tech Corp</p>
              <p>
                Verify candidate credentials instantly. Check authenticity of degrees
                and certificates on the blockchain.
              </p>
              <button className="btn btn-primary">Enter as Employer</button>
            </div>
          </div>
        </div>
      </section>

      <section className="benefits">
        <div className="container">
          <h2 className="section-title">Key Features</h2>

          <div className="grid grid-2">
            <div className="benefit-item">
              <h4>🔒 Blockchain-Based Security</h4>
              <p>All credentials are cryptographically signed and stored on Ethereum</p>
            </div>

            <div className="benefit-item">
              <h4>⚡ Instant Verification</h4>
              <p>Verify credentials in seconds without contacting institutions</p>
            </div>

            <div className="benefit-item">
              <h4>🌐 Decentralized Storage</h4>
              <p>Credential metadata stored on IPFS for permanent availability</p>
            </div>

            <div className="benefit-item">
              <h4>👤 Self-Sovereign Identity</h4>
              <p>Users maintain full control over their digital credentials</p>
            </div>
          </div>
        </div>
      </section>

      <section className="demo-info">
        <div className="container">
          <h2>Demo Information</h2>
          <p style={{textAlign: 'center', maxWidth: '800px', margin: '0 auto'}}>
            This is a demonstration of the Decentralized Identity System MVP.
            All data is simulated and no real blockchain transactions are made.
            Select a role above to explore the different dashboards and features.
          </p>
        </div>
      </section>
    </div>
  );
};

export default HomeDemo;
