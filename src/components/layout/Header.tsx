import { Link } from 'react-router-dom';

export function Header() {
  return (
    <header className="bg-[#1a1a2e] text-white">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6">
        <Link to="/" className="text-lg font-semibold tracking-tight hover:text-slate-200">
          OPENLANE — The Block
        </Link>
        <span className="hidden text-sm text-slate-400 sm:inline">Wholesale vehicle auctions</span>
      </div>
    </header>
  );
}
