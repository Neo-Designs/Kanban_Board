
import { Link } from 'react-router-dom';
import './NotFound.css';

export default function NotFound() {
  return (
    <div className="nf container">
      <p className="nf-code">404</p>
      <h1 className="nf-title">This card fell off the board.</h1>
      <p className="nf-sub">The page you were looking for doesn&apos;t exist — maybe it was moved to Done.</p>
      <Link to="/" className="btn btn-primary">Back to home</Link>
    </div>
  );
}
