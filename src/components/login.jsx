import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../styles/auth.css';

export default function Login() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', password: '' });
  const [errors, setErrors] = useState({});

  const onChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const onSubmit = (e) => {
    e.preventDefault();
    const next = {};
    if (!/^\S+@\S+\.\S+$/.test(form.email)) next.email = 'Enter a valid email address.';
    if (form.password.length < 6) next.password = 'Password must be at least 6 characters.';
    setErrors(next);
    if (Object.keys(next).length === 0) {
      localStorage.setItem('syncboard-logged-in', 'true');
      navigate('/dashboard');
    }
  };

  return (
    <div className="auth container">
      <form className="auth-card card" onSubmit={onSubmit} noValidate>
        <h1 className="auth-title">Welcome back</h1>
        <p className="auth-sub">Log in to pick up where your boards left off.</p>

        <label className="field">
          <span>Email</span>
          <input
            type="email"
            name="email"
            placeholder="you@team.dev"
            value={form.email}
            onChange={onChange}
            autoComplete="email"
          />
          {errors.email && <span className="field-error">{errors.email}</span>}
        </label>

        <label className="field">
          <span>Password</span>
          <input
            type="password"
            name="password"
            placeholder="••••••••"
            value={form.password}
            onChange={onChange}
            autoComplete="current-password"
          />
          {errors.password && <span className="field-error">{errors.password}</span>}
        </label>

        <button type="submit" className="btn btn-primary auth-submit">Log in</button>

        <p className="auth-switch">
          New to SyncBoard? <Link to="/register">Create an account</Link>
        </p>
      </form>
    </div>
  );
}
