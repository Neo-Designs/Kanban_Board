
import { Link } from 'react-router-dom';
import '../styles/home.css';

const icons = {
  columns: (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
      <rect x="3" y="4" width="5" height="12" rx="1.5" />
      <rect x="10" y="4" width="5" height="8" rx="1.5" />
      <rect x="17" y="4" width="5" height="15" rx="1.5" />
    </svg>
  ),
  blocks: (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
      <rect x="3" y="3" width="8" height="8" rx="1.5" />
      <rect x="13" y="13" width="8" height="8" rx="1.5" />
      <rect x="13" y="3" width="8" height="8" rx="1.5" />
    </svg>
  ),
  people: (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
      <circle cx="8" cy="9" r="3.2" />
      <circle cx="16.5" cy="10" r="2.6" />
      <path d="M2.8 19c.7-3 2.8-4.6 5.2-4.6s4.5 1.6 5.2 4.6M14.4 19c.2-2.2 1.1-3.4 2.1-3.8 1.9-.8 4 .5 4.7 3.8" />
    </svg>
  ),
};

const features = [
  {
    title: 'Visual kanban workflow',
    body: 'Organise work in swim-lanes from To Do to Done. Keep the whole team aligned at a glance.',
    icon: icons.columns,
  },
  {
    title: 'Flexible boards',
    body: 'Rename columns, add new stages, and prune old ones — your process, your layout.',
    icon: icons.blocks,
  },
  {
    title: 'Team sync',
    body: 'Assign tasks, set labels and due dates so nothing slips through the cracks.',
    icon: icons.people,
  },
];

export default function Home() {
  return (
    <div className="home container">
      <section className="hero">
        <div className="hero-copy">
          <span className="hero-pill">SyncBoard</span>
          <h1 className="hero-title">
            Sync your team&apos;s <span className="grad-text">flow</span>, not your inbox.
          </h1>
          <p className="hero-sub">
            SyncBoard is a sleek kanban board for modern teams. Plan, track and ship work
            together — this phase ships the polished React client of our MERN application.
          </p>
          <div className="hero-cta">
            <Link to="/register" className="btn btn-primary">Create free account</Link>
            <Link to="/dashboard" className="btn btn-ghost">Preview the dashboard</Link>
          </div>
        </div>
        <div className="hero-board" aria-hidden="true">
          {[
            { name: 'To Do', color: '#6b8f62', cards: ['Write project report', 'Edit image for client'] },
            { name: 'In Progress', color: '#8a7a52', cards: ['Prepare presentation'] },
            { name: 'Done', color: '#5e7d5a', cards: ['Respond to client emails', 'Plan weekly team meeting'] },
          ].map((col) => (
            <div key={col.name} className="hero-col">
              <div className="hero-col-head">
                <span style={{ background: col.color }} className="hero-dot" />
                {col.name}
              </div>
              {col.cards.map((c) => (
                <div key={c} className="hero-card">{c}</div>
              ))}
            </div>
          ))}
        </div>
      </section>

      <section className="features">
        {features.map((f) => (
          <article key={f.title} className="feature-card card">
            <div className="feature-icon">{f.icon}</div>
            <h3 className="feature-title">{f.title}</h3>
            <p className="feature-body">{f.body}</p>
          </article>
        ))}
      </section>

      <section className="cta-band card">
        <div>
          <h2>Ready to board?</h2>
          <p>Create your first board and move with your team.</p>
        </div>
        <Link to="/dashboard" className="btn btn-primary">Go to your boards</Link>
      </section>
    </div>
  );
}
