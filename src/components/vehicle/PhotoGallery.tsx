import { useCallback, useEffect, useState } from 'react';

interface PhotoGalleryProps {
  images: string[];
  alt: string;
}

export function PhotoGallery({ images, alt }: PhotoGalleryProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [mainError, setMainError] = useState(false);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const safeImages = images.length > 0 ? images : [];

  const goTo = useCallback(
    (index: number) => {
      if (safeImages.length === 0) return;
      const next = (index + safeImages.length) % safeImages.length;
      setActiveIndex(next);
      setMainError(false);
    },
    [safeImages.length],
  );

  useEffect(() => {
    if (!lightboxOpen) return;

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setLightboxOpen(false);
      if (e.key === 'ArrowLeft') goTo(activeIndex - 1);
      if (e.key === 'ArrowRight') goTo(activeIndex + 1);
    };

    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', onKeyDown);
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', onKeyDown);
    };
  }, [lightboxOpen, activeIndex, goTo]);

  const counter =
    safeImages.length > 0 ? `${activeIndex + 1} / ${safeImages.length}` : null;

  return (
    <>
      <div className="relative w-full min-w-0 max-w-full overflow-hidden">
        <button
          type="button"
          onClick={() => safeImages.length > 0 && setLightboxOpen(true)}
          disabled={safeImages.length === 0}
          className="group relative block aspect-[4/3] w-full max-w-full overflow-hidden rounded-lg bg-slate-200 lg:aspect-[16/10] disabled:cursor-default"
          aria-label={safeImages.length > 0 ? 'Open photo gallery' : 'No photos available'}
        >
          {!mainError && safeImages[activeIndex] ? (
            <img
              src={safeImages[activeIndex]}
              alt={alt}
              onError={() => setMainError(true)}
              className="h-full w-full max-w-full object-cover transition group-hover:scale-[1.01]"
            />
          ) : (
            <div className="flex h-full items-center justify-center text-slate-500">No image available</div>
          )}
          {counter && (
            <span className="absolute bottom-3 right-3 rounded-md bg-black/70 px-2.5 py-1 text-xs font-semibold text-white">
              {counter}
            </span>
          )}
          {safeImages.length > 1 && (
            <span className="absolute bottom-3 left-3 rounded-md bg-black/50 px-2 py-1 text-xs text-white opacity-0 transition group-hover:opacity-100">
              View gallery
            </span>
          )}
        </button>

        {safeImages.length > 1 && (
          <div className="mt-3 grid grid-cols-4 gap-2 sm:grid-cols-5 lg:grid-cols-6">
            {safeImages.map((src, i) => (
              <button
                key={`${src}-${i}`}
                type="button"
                onClick={() => goTo(i)}
                className={`aspect-[4/3] overflow-hidden rounded-md border-2 ${
                  i === activeIndex ? 'border-openlane-blue ring-2 ring-openlane-blue/30' : 'border-transparent'
                }`}
                aria-label={`View image ${i + 1}`}
                aria-current={i === activeIndex ? 'true' : undefined}
              >
                <img src={src} alt="" className="h-full w-full object-cover" loading="lazy" />
              </button>
            ))}
          </div>
        )}
      </div>

      {lightboxOpen && safeImages[activeIndex] && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 p-4"
          role="dialog"
          aria-modal="true"
          aria-label="Photo gallery"
        >
          <button
            type="button"
            aria-label="Close gallery"
            className="absolute inset-0 cursor-default"
            onClick={() => setLightboxOpen(false)}
          />
          <button
            type="button"
            onClick={() => setLightboxOpen(false)}
            className="absolute right-4 top-4 z-10 rounded-full bg-white/10 px-3 py-1.5 text-sm font-medium text-white hover:bg-white/20"
          >
            Close
          </button>
          {safeImages.length > 1 && (
            <>
              <button
                type="button"
                onClick={() => goTo(activeIndex - 1)}
                className="absolute left-2 top-1/2 z-10 -translate-y-1/2 rounded-full bg-white/10 px-3 py-2 text-white hover:bg-white/20 sm:left-4"
                aria-label="Previous photo"
              >
                ‹
              </button>
              <button
                type="button"
                onClick={() => goTo(activeIndex + 1)}
                className="absolute right-2 top-1/2 z-10 -translate-y-1/2 rounded-full bg-white/10 px-3 py-2 text-white hover:bg-white/20 sm:right-4"
                aria-label="Next photo"
              >
                ›
              </button>
            </>
          )}
          <img
            src={safeImages[activeIndex]}
            alt={`${alt} — photo ${activeIndex + 1}`}
            className="relative z-[1] max-h-[85svh] max-w-full object-contain"
          />
          {counter && (
            <span className="absolute bottom-4 left-1/2 z-10 -translate-x-1/2 rounded-md bg-black/70 px-3 py-1 text-sm font-medium text-white">
              {counter}
            </span>
          )}
        </div>
      )}
    </>
  );
}
