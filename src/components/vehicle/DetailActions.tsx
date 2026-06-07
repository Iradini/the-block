import { useState } from 'react';

export function DetailActions() {
  const [watching, setWatching] = useState(false);
  const [shareMessage, setShareMessage] = useState<string | null>(null);

  const handleWatch = () => {
    setWatching((prev) => !prev);
  };

  const handleShare = async () => {
    const url = window.location.href;
    const title = document.title;

    try {
      if (navigator.share) {
        await navigator.share({ title, url });
        setShareMessage('Shared');
      } else if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(url);
        setShareMessage('Link copied');
      } else {
        setShareMessage('Share not available');
      }
    } catch {
      setShareMessage(null);
      return;
    }

    window.setTimeout(() => setShareMessage(null), 2500);
  };

  return (
    <div className="mb-4 flex min-w-0 flex-wrap items-center gap-2 sm:gap-3">
      <button
        type="button"
        onClick={handleWatch}
        className={`btn-secondary px-3 py-1.5 text-xs sm:text-sm ${watching ? 'border-openlane-blue bg-openlane-blue/5' : ''}`}
        aria-pressed={watching}
      >
        {watching ? 'Watching' : 'Watch'}
      </button>
      <button type="button" onClick={handleShare} className="btn-secondary px-3 py-1.5 text-xs sm:text-sm">
        Share
      </button>
      {shareMessage && (
        <span className="text-xs font-medium text-openlane-blue" aria-live="polite">
          {shareMessage}
        </span>
      )}

      <span className="hidden h-4 w-px bg-openlane-border sm:inline" aria-hidden />

      <nav className="flex min-w-0 flex-wrap items-center gap-x-3 gap-y-1 text-xs sm:text-sm">
        <a href="#condition-report" className="font-medium text-openlane-blue hover:underline">
          Condition report
        </a>
        <span className="text-slate-300" aria-hidden>
          ·
        </span>
        <a href="#specifications" className="font-medium text-openlane-blue hover:underline">
          Specifications
        </a>
        <span className="text-slate-300" aria-hidden>
          ·
        </span>
        <span className="text-slate-500">Seller verified</span>
      </nav>
    </div>
  );
}
