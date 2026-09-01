import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import BoardCard from '../components/BoardCard.jsx';
import boardApi from '../api/boardApi.js';
import authApi from '../api/authApi.js';
import './Dashboard.css';

function NewBoardModal({ onClose, onCreate, creating }) {
  const [form, setForm] = useState({ title: '', description: '' });

  const onSubmit = (e) => {
    e.preventDefault();
    if (!form.title.trim()) return;
    onCreate(form);
  };

  return (
    <div className="modal-backdrop" onClick={onClose} role="presentation">
      <form className="modal card" onClick={(e) => e.stopPropagation()} onSubmit={onSubmit}>
        <h2 className="modal-title">New board</h2>
        <label className="field">
          <span>Board name</span>
          <input
            autoFocus
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
            placeholder="e.g. Product Roadmap"
          />
        </label>
        <label className="field">
          <span>Description <em className="field-optional">(optional)</em></span>
          <input
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            placeholder="What is this board for?"
          />
        </label>
        <div className="modal-actions">
          <button type="button" className="btn btn-ghost" onClick={onClose}>Cancel</button>
          <button type="submit" className="btn btn-primary" disabled={!form.title.trim() || creating}>
            {creating ? 'Creating…' : 'Create board'}
          </button>
        </div>
      </form>
    </div>
  );
}

export default function Dashboard() {
  const navigate = useNavigate();
  const [boards, setBoards] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [creating, setCreating] = useState(false);
  const [showModal, setShowModal] = useState(false);

  const fetchBoards = async () => {
    try {
      setLoading(true);
      setError('');
      const data = await boardApi.getBoards();
      setBoards(data);
    } catch (err) {
      if (err.status === 401) {
        navigate('/login');
      } else {
        setError(err.message || 'Failed to load boards.');
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!authApi.isLoggedIn()) {
      navigate('/login');
      return;
    }
    fetchBoards();
  }, [navigate]);

  const onCreate = async (form) => {
    try {
      setCreating(true);
      const board = await boardApi.createBoard(form);
      setShowModal(false);
      navigate(`/boards/${board.id}`);
    } catch (err) {
      alert(err.message || 'Failed to create board.');
    } finally {
      setCreating(false);
    }
  };

  const onDelete = async (id) => {
    try {
      await boardApi.deleteBoard(id);
      setBoards((prev) => prev.filter((b) => String(b.id) !== String(id)));
    } catch (err) {
      alert(err.message || 'Failed to delete board.');
    }
  };

  if (loading) {
    return (
      <div className="dashboard container" style={{ display: 'grid', placeItems: 'center', minHeight: '50vh' }}>
        <p style={{ color: 'var(--c-text-2)', fontSize: '1rem' }}>Loading your boards…</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="dashboard container">
        <div className="dash-empty card" style={{ borderColor: 'var(--c-danger)' }}>
          <h2 style={{ color: 'var(--c-danger)', margin: '0 0 0.5rem 0' }}>Could not load boards</h2>
          <p className="dash-empty-sub">{error}</p>
          <button className="btn btn-primary" onClick={fetchBoards}>Try again</button>
        </div>
      </div>
    );
  }

  if (boards.length === 0) {
    return (
      <div className="dashboard container">
        <div className="dash-empty card">
          <svg className="dash-empty-art" width="72" height="72" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" aria-hidden="true">
            <rect x="2.5" y="4" width="5" height="11" rx="1.5" />
            <rect x="9.5" y="4" width="5" height="7" rx="1.5" />
            <rect x="16.5" y="4" width="5" height="14" rx="1.5" />
          </svg>
          <h1 className="dash-empty-title">No boards yet</h1>
          <p className="dash-empty-sub">
            Boards keep your projects organised. Create your first one and start
            arranging columns and cards.
          </p>
          <button className="btn btn-primary dash-empty-cta" onClick={() => setShowModal(true)}>
            Get started
          </button>
        </div>
        {showModal && (
          <NewBoardModal
            onClose={() => setShowModal(false)}
            onCreate={onCreate}
            creating={creating}
          />
        )}
      </div>
    );
  }

  return (
    <div className="dashboard container">
      <header className="dash-head">
        <div>
          <h1 className="page-title">Your boards</h1>
          <p className="dash-sub">Pick up a column, pick up a card — everything ships together.</p>
        </div>
        <div className="dash-head-actions">
          <span className="dash-count">{boards.length} board{boards.length === 1 ? '' : 's'}</span>
          <button className="btn btn-primary" onClick={() => setShowModal(true)}>New board</button>
        </div>
      </header>
      <div className="dash-grid">
        {boards.map((b) => (
          <BoardCard key={b.id} board={b} onDelete={() => onDelete(b.id)} />
        ))}
      </div>
      {showModal && (
        <NewBoardModal
          onClose={() => setShowModal(false)}
          onCreate={onCreate}
          creating={creating}
        />
      )}
    </div>
  );
}
