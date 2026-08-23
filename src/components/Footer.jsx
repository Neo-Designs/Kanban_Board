import { Link, useLocation } from 'react-router-dom';
import './Footer.css';

export default function Footer() {
  const location = useLocation();
  const isLoggedIn = localStorage.getItem('syncboard-logged-in') === 'true';

  return (
    <footer className="footer">
      <div className="container footer-inner">
        <p className="footer-brand">SyncBoard · MERN Group Project</p>
        <nav className="footer-links">
          {!isLoggedIn && (
            <>
              <Link to="/login">Log in</Link>
              <Link to="/register">Register</Link>
            </>
          )}
        </nav>
      </div>
    </footer>
  );
}
