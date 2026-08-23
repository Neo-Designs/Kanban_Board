import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../styles/auth.css';

export default function Register() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', email: '', password: '', confirm: '' });
  const [errors, setErrors] = useState({});

  const onChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const onSubmit = (e) => {
    e.preventDefault();
    const next = {};
    if (form.name.trim().length < 2) next.name = 'Please tell us your name.';
    if (!/^\S+@\S+\.\S+$/.test(form.email)) next.email = 'Enter a valid email address.';
    if (form.password.length < 6) next.password = 'Use at least 6 characters.';
    if (form.confirm !== form.password) next.confirm = 'Passwords do not match.';
    setErrors(next);
    if (Object.keys(next).length === 0) {
      localStorage.setItem('syncboard-logged-in', 'true');
      localStorage.setItem('syncboard-first-time', 'true');
      navigate('/profile');
    }
  };

  return (
    <div className="auth container">
      <form className="auth-card card" onSubmit={onSubmit} noValidate>
        <h1 className="auth-title">Create your account</h1>
        <p className="auth-sub">One workspace for every board you squad on.</p>

        <label className="field">
          <span>Full name</span>
          <input type="text" name="name" placeholder="Ada Lovelace" value={form.name} onChange={onChange} autoComplete="name" />
          {errors.name && <span className="field-error">{errors.name}</span>}
        </label>

        <label className="field">
          <span>Email</span>
          <input type="email" name="email" placeholder="you@team.dev" value={form.email} onChange={onChange} autoComplete="email" />
          {errors.email && <span className="field-error">{errors.email}</span>}
        </label>

        <label className="field">
          <span>Password</span>
          <input type="password" name="password" placeholder="••••••••" value={form.password} onChange={onChange} autoComplete="new-password" />
          {errors.password && <span className="field-error">{errors.password}</span>}
        </label>

        <label className="field">
          <span>Confirm password</span>
          <input type="password" name="confirm" placeholder="••••••••" value={form.confirm} onChange={onChange} autoComplete="new-password" />
          {errors.confirm && <span className="field-error">{errors.confirm}</span>}
        </label>

        <button type="submit" className="btn btn-primary auth-submit">Create account</button>

        <p className="auth-switch">
          Already have an account? <Link to="/login">Log in</Link>
        </p>
      </form>
    </div>
  );
}
