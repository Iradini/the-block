import { Link } from 'react-router-dom';

export function NotFoundPage() {
  return (
    <div className="mx-auto flex max-w-lg flex-col items-center px-4 py-20 text-center">
      <h1 className="text-2xl font-semibold text-slate-900">Page not found</h1>
      <p className="mt-2 text-slate-600">The vehicle or page you are looking for does not exist.</p>
      <Link
        to="/"
        className="mt-6 rounded-lg bg-[#1a1a2e] px-5 py-2.5 text-sm font-medium text-white hover:bg-slate-800"
      >
        Back to inventory
      </Link>
    </div>
  );
}
