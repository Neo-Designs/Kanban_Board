
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import BoardCard from '../components/BoardCard.jsx';
import { createBoard, deleteBoard, loadBoards } from '../data/boardStore.js';
import './Dashboard.css';

function NewBoardModal({ onClose, onCreate }) {
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
          <button type="submit" className="btn btn-primary" disabled={!form.title.trim()}>
            Create board
          </button>
        </div>
      </form>
    </div>
  );
}

export default function Dashboard() {
  const navigate = useNavigate();
  const [boards, setBoards] = useState(() => loadBoards());
  const [showModal, setShowModal] = useState(false);

  const onCreate = (form) => {
    const board = createBoard(form);
    navigate(`/boards/${board.id}`);
  };

  const onDelete = (id) => {
    deleteBoard(id);
    setBoards(loadBoards());
  };

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
        {showModal && <NewBoardModal onClose={() => setShowModal(false)} onCreate={onCreate} />}
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
      {showModal && <NewBoardModal onClose={() => setShowModal(false)} onCreate={onCreate} />}
    </div>
  );
}
