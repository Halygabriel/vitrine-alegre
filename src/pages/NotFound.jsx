import EmptyState from '../components/EmptyState.jsx';
import Footer from '../components/Footer.jsx';
import Header from '../components/Header.jsx';
import './NotFound.css';

export default function NotFound() {
  return (
    <div className="app-shell">
      <Header mobileTitle="Page not found" />
      <main className="app-main container not-found-wrap">
        <EmptyState type="search" title="404 · Page not found" message="The page you requested does not exist." actionLabel="Back to store" to="/" />
      </main>
      <Footer />
    </div>
  );
}
