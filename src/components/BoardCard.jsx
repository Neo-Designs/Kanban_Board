
import { Link } from 'react-router-dom';
import './BoardCard.css';

export default function BoardCard({ board, onDelete }) {
  return (
    <Link to={`/boards/${board.id}`} className="board-card card">
      <span className="board-card-accent" style={{ background: board.accent }} />
      {onDelete && (
        <button
          className="icon-btn danger board-card-delete"
          title="Delete board"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            onDelete();
          }}
        >
          ✕
        </button>
      )}
      <h3 className="board-card-title">{board.title}</h3>
      <p className="board-card-desc">{board.description || 'No description yet.'}</p>
      <div className="board-card-meta">
        <span className="board-card-date">
          {new Date(board.createdAt).toLocaleDateString(undefined, { day: 'numeric', month: 'short' })}
        </span>
        <span className="board-open">Open board →</span>
      </div>
    </Link>
  );
}
