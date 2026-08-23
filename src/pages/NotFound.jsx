/**
 * ==============================================================================
 * Author: James Rajawasam
 * Description: 404 "Not Found" error page component. Displays a user-friendly
 *              error status code, an informative message when a route doesn't exist,
 *              and a navigation link to return the user back to the home page.
 * ==============================================================================
 */
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
