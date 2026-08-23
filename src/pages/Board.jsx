
import { useEffect, useMemo, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import Column from '../components/Column.jsx';
import { COLUMN_ACCENTS, seedBoard } from '../data/board.js';
import { getBoard } from '../data/boardStore.js';
import './Board.css';

const uid = () => `id-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 7)}`;

function loadBoard(id) {
  try {
    const raw = localStorage.getItem(`syncboard-board-${id}`);
    if (raw) return JSON.parse(raw);
  } catch {

  }
  const seed = seedBoard(id);
  return { ...seed, id };
}

export default function Board() {
  const { id } = useParams();
  const meta = useMemo(() => getBoard(id), [id]);
  const [board, setBoard] = useState(() => loadBoard(id));
  const [editingCard, setEditingCard] = useState(null);

  const [showInviteModal, setShowInviteModal] = useState(false);
  const [inviteEmail, setInviteEmail] = useState('');
  const [inviteName, setInviteName] = useState('');
  const [inviteStatus, setInviteStatus] = useState('');

  const currentUserInitials = useMemo(() => {
    try {
      const rawProfile = localStorage.getItem('syncboard-profile');
      if (rawProfile) {
        const profile = JSON.parse(rawProfile);
        if (profile.name) {
          const initials = profile.name.trim().split(/\s+/).map((n) => n[0]).join('').toUpperCase();
          if (initials) return initials;
        }
      }
    } catch (e) {

    }
    return 'US';
  }, []);

  useEffect(() => { setBoard(loadBoard(id)); }, [id]);

  useEffect(() => {
    localStorage.setItem(`syncboard-board-${id}`, JSON.stringify(board));
  }, [board, id]);

  const updateColumn = (colId, updater) =>
    setBoard((b) => ({
      ...b,
      columns: b.columns.map((c) => (c.id === colId ? updater(c) : c)),
    }));

  const renameColumn = (colId, title) =>
    updateColumn(colId, (c) => ({ ...c, title }));

  const removeColumn = (colId) =>
    setBoard((b) => ({ ...b, columns: b.columns.filter((c) => c.id !== colId) }));

  const handleOpenAddModal = (colId, initialTitle = '') => {
    setEditingCard({
      type: 'add',
      colId,
      card: {
        id: uid(),
        title: initialTitle,
        label: '',
        labelColor: '#6B8F62',
        assignee: '',
        due: '',
      },
    });
  };

  const handleOpenEditModal = (colId, cardId) => {
    const col = board.columns.find((c) => c.id === colId);
    const card = col?.cards.find((k) => k.id === cardId);
    if (card) {
      setEditingCard({
        type: 'edit',
        colId,
        card: { ...card },
      });
    }
  };

  const removeCard = (colId, cardId) =>
    updateColumn(colId, (c) => ({ ...c, cards: c.cards.filter((k) => k.id !== cardId) }));

  const moveCard = (cardId, fromColId, toColId, beforeCardId = null) => {
    if (fromColId === toColId && (beforeCardId === cardId || beforeCardId === null)) return;
    setBoard((b) => {
      const from = b.columns.find((c) => c.id === fromColId);
      const to = b.columns.find((c) => c.id === toColId);
      const card = from?.cards.find((k) => k.id === cardId);
      if (!card || !to) return b;
      const toCards = to.cards.filter((k) => k.id !== cardId);
      const idx = beforeCardId ? toCards.findIndex((k) => k.id === beforeCardId) : toCards.length;
      toCards.splice(idx === -1 ? toCards.length : idx, 0, card);
      return {
        ...b,
        columns: b.columns.map((c) =>
          c.id === fromColId
            ? { ...c, cards: c.cards.filter((k) => k.id !== cardId) }
            : c.id === toColId
              ? { ...c, cards: toCards }
              : c
        ),
      };
    });
  };

  const addColumn = () =>
    setBoard((b) => ({
      ...b,
      columns: [
        ...b.columns,
        {
          id: uid(),
          title: `Column ${b.columns.length + 1}`,
          accent: COLUMN_ACCENTS[b.columns.length % COLUMN_ACCENTS.length],
          cards: [],
        },
      ],
    }));

  if (!meta) {
    return (
      <div className="board container">
        <div className="board-missing card">
          <h1 className="page-title">Board not found</h1>
          <p className="board-sub">This board doesn&apos;t exist (yet) — create one from your dashboard.</p>
          <Link to="/dashboard" className="btn btn-primary">Back to dashboard</Link>
        </div>
      </div>
    );
  }

  const handleInviteSubmit = (e) => {
    e.preventDefault();
    if (!inviteEmail) return;
    const name = inviteName.trim() || inviteEmail.split('@')[0];
    const newCollab = { email: inviteEmail.trim(), name };

    const updatedCollaborators = [...(board.collaborators || []), newCollab];
    const updatedBoard = { ...board, collaborators: updatedCollaborators };
    setBoard(updatedBoard);

    setInviteStatus(`✓ Invite email sent to ${inviteEmail}!`);
    setInviteEmail('');
    setInviteName('');
    setTimeout(() => {
      setInviteStatus('');
      setShowInviteModal(false);
    }, 2000);
  };

  return (
    <div className="board container">
      <header className="board-head" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <Link to="/dashboard" className="board-back">← Boards</Link>
          <h1 className="page-title" style={{ margin: 0 }}>{meta.title}</h1>
          {meta.description && <p className="board-sub" style={{ margin: '0.4rem 0 0 0' }}>{meta.description}</p>}

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '0.75rem', flexWrap: 'wrap' }}>
            <div style={{ display: 'flex', gap: '0.25rem' }}>
              <span title={`You (${currentUserInitials})`} style={{
                width: '28px', height: '28px', borderRadius: '50%', background: 'var(--c-primary)', color: '#fff',
                display: 'grid', placeItems: 'center', fontSize: '0.75rem', fontWeight: 700
              }}>
                {currentUserInitials}
              </span>
              {(board.collaborators || []).map((collab, index) => {
                const initials = collab.name.slice(0, 2).toUpperCase();
                return (
                  <span key={index} title={`${collab.name} (${collab.email})`} style={{
                    width: '28px', height: '28px', borderRadius: '50%', background: 'var(--c-surface-2)', border: '1px solid var(--c-border)',
                    color: 'var(--c-text-2)', display: 'grid', placeItems: 'center', fontSize: '0.75rem', fontWeight: 700
                  }}>
                    {initials}
                  </span>
                );
              })}
            </div>

            <button
              onClick={() => setShowInviteModal(true)}
              className="btn btn-ghost"
              style={{ padding: '0.2rem 0.5rem', fontSize: '0.75rem', height: 'auto', display: 'flex', alignItems: 'center', gap: '0.25rem' }}
            >
              + Invite
            </button>
          </div>
        </div>
        <p className="board-hint" style={{ margin: 0 }}>Tip: drag cards between columns; click a column title to rename it.</p>
      </header>

      <div className="board-canvas">
        {board.columns.map((col) => (
          <Column
            key={col.id}
            column={col}
            onRename={(title) => renameColumn(col.id, title)}
            onRemove={() => removeColumn(col.id)}
            onAddCard={(title) => handleOpenAddModal(col.id, title)}
            onEditCard={(cardId) => handleOpenEditModal(col.id, cardId)}
            onRemoveCard={(cardId) => removeCard(col.id, cardId)}
            onMoveCard={moveCard}
          />
        ))}
        <button className="board-add-col" onClick={addColumn}>
          <span className="board-add-plus">+</span> Add column
        </button>
      </div>

      {showInviteModal && (
        <div style={{
          position: 'fixed',
          top: 0, left: 0, right: 0, bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          zIndex: 1000, padding: '1rem',
        }}>
          <form
            onSubmit={handleInviteSubmit}
            style={{
              backgroundColor: 'var(--c-surface)',
              border: '1px solid var(--c-border)',
              borderRadius: 'var(--r-md)',
              padding: '1.5rem',
              width: '100%',
              maxWidth: '350px',
              boxShadow: 'var(--shadow-lg)',
              display: 'flex',
              flexDirection: 'column',
              gap: '1rem',
            }}
          >
            <h2 style={{ fontSize: '1.25rem', fontWeight: 700, margin: 0 }}>Invite Collaborator</h2>

            {inviteStatus && (
              <div style={{ padding: '0.5rem', borderRadius: 'var(--r-sm)', background: 'rgba(107, 143, 98, 0.1)', color: 'var(--c-primary)', fontSize: '0.85rem', fontWeight: 600 }}>
                {inviteStatus}
              </div>
            )}

            <label className="field" style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
              <span style={{ fontSize: '0.85rem', fontWeight: 600 }}>Email Address</span>
              <input
                type="email"
                required
                placeholder="collab@team.dev"
                style={{
                  padding: '0.5rem',
                  borderRadius: 'var(--r-sm)',
                  border: '1px solid var(--c-border)',
                  background: 'var(--c-surface)',
                  color: 'var(--c-text)',
                  width: '100%',
                  boxSizing: 'border-box'
                }}
                value={inviteEmail}
                onChange={(e) => setInviteEmail(e.target.value)}
              />
            </label>

            <label className="field" style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
              <span style={{ fontSize: '0.85rem', fontWeight: 600 }}>Name / Initials (optional)</span>
              <input
                type="text"
                placeholder="e.g. John Doe or JD"
                style={{
                  padding: '0.5rem',
                  borderRadius: 'var(--r-sm)',
                  border: '1px solid var(--c-border)',
                  background: 'var(--c-surface)',
                  color: 'var(--c-text)',
                  width: '100%',
                  boxSizing: 'border-box'
                }}
                value={inviteName}
                onChange={(e) => setInviteName(e.target.value)}
              />
            </label>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.5rem', marginTop: '0.5rem' }}>
              <button
                type="button"
                className="btn btn-ghost"
                onClick={() => { setShowInviteModal(false); setInviteStatus(''); }}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="btn btn-primary"
              >
                Send Invite
              </button>
            </div>
          </form>
        </div>
      )}
      {editingCard && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000,
          padding: '1rem',
        }}>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              const { colId, card } = editingCard;
              if (editingCard.type === 'add') {
                updateColumn(colId, (c) => ({
                  ...c,
                  cards: [...c.cards, card],
                }));
              } else {
                updateColumn(colId, (c) => ({
                  ...c,
                  cards: c.cards.map((k) => (k.id === card.id ? card : k)),
                }));
              }
              setEditingCard(null);
            }}
            style={{
              backgroundColor: 'var(--c-surface)',
              border: '1px solid var(--c-border)',
              borderRadius: 'var(--r-md)',
              padding: '1.5rem',
              width: '100%',
              maxWidth: '520px',
              boxShadow: 'var(--shadow-lg)',
              display: 'flex',
              flexDirection: 'column',
              gap: '1.25rem',
            }}
          >
            <h2 style={{ fontSize: '1.25rem', fontWeight: 700, margin: 0 }}>
              {editingCard.type === 'add' ? 'Add Task Card' : 'Edit Task Card'}
            </h2>

            <label className="field" style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
              <span style={{ fontSize: '0.85rem', fontWeight: 600 }}>Title</span>
              <input
                type="text"
                required
                style={{
                  padding: '0.5rem',
                  borderRadius: 'var(--r-sm)',
                  border: '1px solid var(--c-border)',
                  background: 'var(--c-surface)',
                  color: 'var(--c-text)',
                  width: '100%',
                  boxSizing: 'border-box'
                }}
                value={editingCard.card.title}
                onChange={(e) => setEditingCard({
                  ...editingCard,
                  card: { ...editingCard.card, title: e.target.value }
                })}
              />
            </label>

            <div style={{ display: 'flex', gap: '1rem' }}>
              <label className="field" style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                <span style={{ fontSize: '0.85rem', fontWeight: 600 }}>Tag</span>
                <input
                  type="text"
                  placeholder="e.g. Design"
                  style={{
                    padding: '0.5rem',
                    borderRadius: 'var(--r-sm)',
                    border: '1px solid var(--c-border)',
                    background: 'var(--c-surface)',
                    color: 'var(--c-text)',
                    width: '100%',
                    boxSizing: 'border-box'
                  }}
                  value={editingCard.card.label}
                  onChange={(e) => setEditingCard({
                    ...editingCard,
                    card: { ...editingCard.card, label: e.target.value }
                  })}
                />
              </label>

              <label className="field" style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                <span style={{ fontSize: '0.85rem', fontWeight: 600 }}>Tag Color</span>
                <select
                  style={{
                    padding: '0.5rem',
                    borderRadius: 'var(--r-sm)',
                    border: '1px solid var(--c-border)',
                    background: 'var(--c-surface)',
                    color: 'var(--c-text)',
                    width: '100%',
                    boxSizing: 'border-box'
                  }}
                  value={editingCard.card.labelColor}
                  onChange={(e) => setEditingCard({
                    ...editingCard,
                    card: { ...editingCard.card, labelColor: e.target.value }
                  })}
                >
                  <option value="#6B8F62">Green (Frontend)</option>
                  <option value="#A07850">Brown (Design)</option>
                  <option value="#5F7D6E">Teal (Docs)</option>
                  <option value="#B08D3F">Gold (Chore)</option>
                  <option value="#8A7A52">Olive (Setup)</option>
                  <option value="#E07A5F">Coral</option>
                  <option value="#3F51B5">Indigo</option>
                </select>
              </label>
            </div>

            <div style={{ display: 'flex', gap: '1rem' }}>
              <label className="field" style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                <span style={{ fontSize: '0.85rem', fontWeight: 600 }}>Collaborator</span>
                <input
                  type="text"
                  placeholder="e.g. AK"
                  list="collab-datalist"
                  style={{
                    padding: '0.5rem',
                    borderRadius: 'var(--r-sm)',
                    border: '1px solid var(--c-border)',
                    background: 'var(--c-surface)',
                    color: 'var(--c-text)',
                    width: '100%',
                    boxSizing: 'border-box'
                  }}
                  value={editingCard.card.assignee}
                  onChange={(e) => setEditingCard({
                    ...editingCard,
                    card: { ...editingCard.card, assignee: e.target.value }
                  })}
                />
                <datalist id="collab-datalist">
                  <option value={currentUserInitials} />
                  {(board.collaborators || []).map((collab, idx) => (
                    <option key={idx} value={collab.name} />
                  ))}
                </datalist>
              </label>

              <label className="field" style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                <span style={{ fontSize: '0.85rem', fontWeight: 600 }}>Due Date</span>
                <input
                  type="text"
                  placeholder="e.g. Aug 25"
                  style={{
                    padding: '0.5rem',
                    borderRadius: 'var(--r-sm)',
                    border: '1px solid var(--c-border)',
                    background: 'var(--c-surface)',
                    color: 'var(--c-text)',
                    width: '100%',
                    boxSizing: 'border-box'
                  }}
                  value={editingCard.card.due}
                  onChange={(e) => setEditingCard({
                    ...editingCard,
                    card: { ...editingCard.card, due: e.target.value }
                  })}
                />
              </label>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.5rem', marginTop: '0.5rem' }}>
              <button
                type="button"
                className="btn btn-ghost"
                onClick={() => setEditingCard(null)}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="btn btn-primary"
              >
                Save
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
