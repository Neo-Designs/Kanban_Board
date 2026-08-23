import { useState } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import './Navbar.css';

function Logo() {
  return (
    <Link to="/" className="nav-logo" aria-label="SyncBoard home">
      <svg viewBox="0 0 32 32" width="26" height="26" aria-hidden="true">
        <rect width="32" height="32" rx="8" fill="url(#nav-grad)" />
        <defs>
          <linearGradient id="nav-grad" x1="0" y1="0" x2="32" y2="32">
            <stop offset="0" stopColor="#6b8f62" />
            <stop offset="1" stopColor="#6b8f62" />
          </linearGradient>
        </defs>
        <rect x="7" y="7" width="6" height="12" rx="1.5" fill="#fff" opacity="0.9" />
        <rect x="15" y="7" width="6" height="8" rx="1.5" fill="#fff" opacity="0.75" />
        <rect x="23" y="7" width="6" height="16" rx="1.5" fill="#fff" opacity="0.6" />
      </svg>
      <span>SyncBoard</span>
    </Link>
  );
}

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const location = useLocation();
  const isLoggedIn = localStorage.getItem('syncboard-logged-in') === 'true';

  const handleLogout = () => {
    localStorage.removeItem('syncboard-logged-in');
    localStorage.removeItem('syncboard-profile');
    localStorage.removeItem('syncboard-first-time');
    window.location.href = '/';
  };

  const links = [
    { to: '/', label: 'Home', end: true },
    { to: '/dashboard', label: 'Dashboard' },
    { to: '/profile', label: 'Profile' },
  ];

  return (
    <header className="nav">
      <div className="nav-inner container">
        <Logo />
        <nav className={`nav-links ${open ? 'is-open' : ''}`} onClick={() => setOpen(false)}>
          {links.map((l) => (
            <NavLink
              key={l.to}
              to={l.to}
              end={l.end}
              className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
            >
              {l.label}
            </NavLink>
          ))}
          {isLoggedIn ? (
            <button onClick={handleLogout} className="btn btn-ghost nav-cta-ghost">Log out</button>
          ) : (
            <>
              <Link to="/login" className="btn btn-ghost nav-cta-ghost">Log in</Link>
              <Link to="/register" className="btn btn-primary nav-cta">Get started</Link>
            </>
          )}
        </nav>
        <button
          className="nav-burger"
          aria-label="Toggle menu"
          aria-expanded={open}
          onClick={() => setOpen((v) => !v)}
        >
          <span className={open ? 'bar open' : 'bar'} />
          <span className={open ? 'bar open' : 'bar'} />
          <span className={open ? 'bar open' : 'bar'} />
        </button>
      </div>
    </header>
  );
}
