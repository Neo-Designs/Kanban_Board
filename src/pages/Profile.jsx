import { useState } from 'react';
import './Profile.css';

export default function Profile() {
  const [profile, setProfile] = useState(() => {
    const savedProfile = localStorage.getItem('syncboard-profile');
    if (savedProfile) {
      try {
        return JSON.parse(savedProfile);
      } catch {

      }
    }
    const isFirstTime = localStorage.getItem('syncboard-first-time') === 'true';
    if (isFirstTime) {
      return { name: '', role: '', email: '', bio: '' };
    }
    return {
      name: 'Alex Kim',
      role: 'Frontend Lead',
      email: 'alex@syncboard.dev',
      bio: 'Keeping boards tidy and pixel-perfect.',
    };
  });
  const [saved, setSaved] = useState(false);

  const onChange = (e) => {
    setProfile({ ...profile, [e.target.name]: e.target.value });
    setSaved(false);
  };

  const onSubmit = (e) => {
    e.preventDefault();
    localStorage.setItem('syncboard-profile', JSON.stringify(profile));
    localStorage.removeItem('syncboard-first-time');
    setSaved(true);
  };

  return (
    <div className="profile container">
      <h1 className="page-title">Profile</h1>
      <div className="profile-grid">
        <section className="card profile-id">
          <div className="profile-avatar" aria-hidden="true">AK</div>
          <h2 className="profile-name">{profile.name}</h2>
          <p className="profile-role">{profile.role}</p>
          <p className="profile-email">{profile.email}</p>
          <div className="profile-stats">
            <div><strong>4</strong><span>boards</span></div>
            <div><strong>12</strong><span>tasks done</span></div>
            <div><strong>3</strong><span>teams</span></div>
          </div>
        </section>

        <form className="card profile-form" onSubmit={onSubmit}>
          <h2 className="profile-form-title">Account settings</h2>
          <label className="field">
            <span>Display name</span>
            <input name="name" value={profile.name} onChange={onChange} />
          </label>
          <label className="field">
            <span>Role</span>
            <input name="role" value={profile.role} onChange={onChange} />
          </label>
          <label className="field">
            <span>Email</span>
            <input type="email" name="email" value={profile.email} onChange={onChange} />
          </label>
          <label className="field">
            <span>Bio</span>
            <textarea name="bio" rows="3" value={profile.bio} onChange={onChange} />
          </label>
          <div className="profile-form-actions">
            <button type="submit" className="btn btn-primary">Save changes</button>
            {saved && <span className="profile-saved">✓ Saved (mock — no backend yet)</span>}
          </div>
        </form>
      </div>
    </div>
  );
}
