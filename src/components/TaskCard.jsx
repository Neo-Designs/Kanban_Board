/**
 * Hiruka Hendawitharane
 * Component: TaskCard
 * Renders an individual task item with drag-and-drop capability,
 * metadata display such as due dates, assignees, labels and an inline delete confirmation flow.
 */
import { useState } from 'react';

export default function TaskCard({ card, columnId, onRemove, onEdit }) {
  const [confirming, setConfirming] = useState(false);

  const handleDeleteClick = (e) => {
    e.stopPropagation();
    setConfirming(true);
  };

  const handleConfirmDelete = (e) => {
    e.stopPropagation();
    onRemove();
    setConfirming(false);
  };

  const handleCancelDelete = (e) => {
    e.stopPropagation();
    setConfirming(false);
  };

  if (confirming) {
    return (
      <article
        className="task confirming"
        style={{ '--label-color': card.labelColor || '#6b8f62', padding: '1rem', border: '1px solid var(--c-danger)' }}
      >
        <h4 className="task-title" style={{ margin: '0 0 0.5rem 0', fontSize: '0.9rem' }}>Delete this card?</h4>
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <button className="confirm-yes" style={{ flex: 1, padding: '0.25rem' }} onClick={handleConfirmDelete}>Delete</button>
          <button className="confirm-no" style={{ flex: 1, padding: '0.25rem' }} onClick={handleCancelDelete}>Cancel</button>
        </div>
      </article>
    );
  }

  return (
    <article
      className="task"
      style={{ '--label-color': card.labelColor || '#6b8f62' }}
      draggable
      onDragStart={(e) => {
        e.dataTransfer.setData('application/json', JSON.stringify({ cardId: card.id, fromColId: columnId }));
        e.dataTransfer.effectAllowed = 'move';
      }}
      onClick={onEdit}
    >
      <div className="task-top">
        <span className="task-label">{card.label || 'Task'}</span>
        <button className="icon-btn danger task-remove" title="Delete card" onClick={handleDeleteClick}>
          ✕
        </button>
      </div>
      <h4 className="task-title">{card.title}</h4>
      <div className="task-meta">
        {card.due && (
          <span className="task-due">
            <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" aria-hidden="true">
              <rect x="3" y="5" width="18" height="16" rx="2" />
              <path d="M8 3v4M16 3v4M3 10h18" />
            </svg>
            {card.due}
          </span>
        )}
        {card.assignee && <span className="task-assignee">{card.assignee}</span>}
      </div>
    </article>
  );
}
