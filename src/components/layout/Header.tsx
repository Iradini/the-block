import { Link } from 'react-router-dom';

export function Header() {
  return (
    <header className="sticky top-0 z-40 bg-auction-dark text-white">
      <div className="mx-auto flex w-full max-w-7xl min-w-0 items-center justify-between gap-3 px-4 py-3 sm:px-6">
        <Link to="/" className="min-w-0 shrink-0">
          <span className="text-lg font-bold tracking-tight sm:text-xl">OPENLANE</span>
          <span className="block text-[10px] font-medium uppercase tracking-widest text-slate-400 sm:text-xs">
            The Block · Wholesale Auctions
          </span>
        </Link>

        <nav className="hidden items-center gap-5 text-sm font-medium text-slate-300 md:flex">
          <Link to="/" className="transition hover:text-white">
            Auctions
          </Link>
          <a
            href="https://www.openlane.com/buyers/"
            target="_blank"
            rel="noopener noreferrer"
            className="transition hover:text-white"
          >
            Source Inventory
          </a>
          <a
            href="https://www.openlane.com/"
            target="_blank"
            rel="noopener noreferrer"
            className="transition hover:text-white"
          >
            Contact Us
          </a>
        </nav>

        <div className="flex shrink-0 items-center gap-2">
          <a
            href="https://www.openlane.com/buyers/"
            target="_blank"
            rel="noopener noreferrer"
            className="btn-ghost hidden border-slate-500 px-3 py-1.5 text-xs text-white hover:bg-white/10 sm:inline-flex sm:text-sm"
          >
            Log in
          </a>
          <a
            href="https://www.openlane.com/buyers/"
            target="_blank"
            rel="noopener noreferrer"
            className="btn-primary px-3 py-1.5 text-xs sm:px-4 sm:text-sm"
          >
            Sign up
          </a>
        </div>
      </div>
    </header>
  );
}
