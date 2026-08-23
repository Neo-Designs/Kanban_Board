/**
 * Hiruka Hendawitharane 
 * Component: Column
 * Renders a single Kanban column, manages column title renaming/deletion,
 * handles card creation, and serves as the drop target for drag-and-drop actions.
 */
import { useEffect, useRef, useState } from 'react';
import TaskCard from './TaskCard.jsx';

export default function Column({ column, onRename, onRemove, onAddCard, onRemoveCard, onMoveCard, onEditCard }) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(column.title);
  const [confirming, setConfirming] = useState(false);
  const [newCard, setNewCard] = useState('');
  const inputRef = useRef(null);

  useEffect(() => {
    if (editing) inputRef.current?.select();
  }, [editing]);

  const saveTitle = () => {
    const value = draft.trim();
    if (value) onRename(value);
    else setDraft(column.title);
    setEditing(false);
  };

  const submitCard = (e) => {
    e.preventDefault();
    onAddCard(newCard.trim());
    setNewCard('');
  };

  return (
    <section className="col" style={{ '--col-accent': column.accent }}>
      <header className="col-head">
        {editing ? (
          <input
            ref={inputRef}
            className="col-title-input"
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            onBlur={saveTitle}
            onKeyDown={(e) => {
              if (e.key === 'Enter') saveTitle();
              if (e.key === 'Escape') { setDraft(column.title); setEditing(false); }
            }}
          />
        ) : (
          <button className="col-title" title="Click to rename" onClick={() => { setDraft(column.title); setEditing(true); }}>
            {column.title}
          </button>
        )}
        <span className="col-count">{column.cards.length}</span>
        {confirming ? (
          <span className="col-confirm">
            <button className="confirm-yes" onClick={() => { onRemove(); setConfirming(false); }}>Delete</button>
            <button className="confirm-no" onClick={() => setConfirming(false)}>Keep</button>
          </span>
        ) : (
          <button className="icon-btn danger col-remove" title="Delete column" onClick={() => setConfirming(true)}>
            ✕
          </button>
        )}
      </header>

      <div
        className="col-cards"
        onDragOver={(e) => {
          e.preventDefault();
          e.currentTarget.classList.add('col-drop-target');
        }}
        onDragLeave={(e) => e.currentTarget.classList.remove('col-drop-target')}
        onDrop={(e) => {
          e.preventDefault();
          e.currentTarget.classList.remove('col-drop-target');
          try {
            const { cardId, fromColId } = JSON.parse(e.dataTransfer.getData('application/json'));
            if (cardId && fromColId) onMoveCard(cardId, fromColId, column.id);
          } catch {

          }
        }}
      >
        {column.cards.map((card) => (
          <TaskCard
            key={card.id}
            card={card}
            columnId={column.id}
            onRemove={() => onRemoveCard(card.id)}
            onEdit={() => onEditCard && onEditCard(card.id)}
          />
        ))}
        {column.cards.length === 0 && <p className="col-empty">No cards yet — drag one here</p>}
      </div>

      <form className="col-add" onSubmit={submitCard}>
        <input
          value={newCard}
          onChange={(e) => setNewCard(e.target.value)}
          placeholder="Add a card…"
          aria-label={`Add card to ${column.title}`}
        />
        <button type="submit" className="col-add-btn">+</button>
      </form>
    </section>
  );
}
