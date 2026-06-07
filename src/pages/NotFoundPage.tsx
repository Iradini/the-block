import { Link } from 'react-router-dom';

export function NotFoundPage() {
  return (
    <div className="page-container flex flex-col items-center py-20 text-center">
      <h1 className="text-2xl font-semibold text-openlane-navy">Page not found</h1>
      <p className="mt-2 text-slate-600">The vehicle or page you are looking for does not exist.</p>
      <Link to="/" className="btn-primary mt-6">
        Back to inventory
      </Link>
    </div>
  );
}
