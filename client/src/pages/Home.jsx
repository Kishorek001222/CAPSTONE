import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Home.css';

const Home = () => {
  const { isAuthenticated, user } = useAuth();

  return (
    <div className="home">
      <section className="hero">
        <h1 className="hero-title">Decentralized Identity System</h1>
        <p className="hero-subtitle">
          Take control of your digital credentials with blockchain-powered Self-Sovereign Identity
        </p>

        {!isAuthenticated ? (
          <div className="hero-actions">
            <Link to="/signup" className="btn btn-primary btn-lg">
              Get Started
            </Link>
            <Link to="/login" className="btn btn-outline btn-lg">
              Login
            </Link>
          </div>
        ) : (
          <div className="hero-actions">
            <Link to="/dashboard" className="btn btn-primary btn-lg">
              Go to Dashboard
            </Link>
          </div>
        )}
      </section>

      <section className="features">
        <div className="container">
          <h2 className="section-title">How It Works</h2>
          
          <div className="grid grid-3">
            <div className="feature-card">
              <div className="feature-icon">🎓</div>
              <h3>For Students</h3>
              <p>
                Receive verifiable credentials from your university. Store them securely on the blockchain
                and share them instantly with employers.
              </p>
            </div>

            <div className="feature-card">
              <div className="feature-icon">🏛️</div>
              <h3>For Universities</h3>
              <p>
                Issue tamper-proof digital credentials to students. Credentials are stored on IPFS and
                anchored to the blockchain for permanent verification.
              </p>
            </div>

            <div className="feature-card">
              <div className="feature-icon">💼</div>
              <h3>For Employers</h3>
              <p>
                Instantly verify candidate credentials without contacting universities. All verifications
                are done on-chain for maximum trust.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="benefits">
        <div className="container">
          <h2 className="section-title">Key Benefits</h2>
          
          <div className="grid grid-2">
            <div className="benefit-item">
              <h4>🔒 Secure & Tamper-Proof</h4>
              <p>All credentials are cryptographically signed and stored on the blockchain</p>
            </div>

            <div className="benefit-item">
              <h4>⚡ Instant Verification</h4>
              <p>Verify credentials in seconds without contacting issuing institutions</p>
            </div>

            <div className="benefit-item">
              <h4>🌐 Decentralized Storage</h4>
              <p>Credential data stored on IPFS ensures availability and censorship resistance</p>
            </div>

            <div className="benefit-item">
              <h4>👤 User-Controlled</h4>
              <p>You own your credentials and decide who can access them</p>
            </div>
          </div>
        </div>
      </section>

      <section className="cta">
        <div className="container">
          <h2>Ready to Get Started?</h2>
          <p>Join the future of digital credentials today</p>
          {!isAuthenticated && (
            <Link to="/signup" className="btn btn-primary btn-lg">
              Create Account
            </Link>
          )}
        </div>
      </section>
    </div>
  );
};

export default Home;
