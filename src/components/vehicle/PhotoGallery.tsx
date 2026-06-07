import { useState } from 'react';

interface PhotoGalleryProps {
  images: string[];
  alt: string;
}

export function PhotoGallery({ images, alt }: PhotoGalleryProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [mainError, setMainError] = useState(false);
  const safeImages = images.length > 0 ? images : [];

  return (
    <div className="w-full min-w-0 max-w-full overflow-hidden">
      <div className="aspect-[4/3] w-full max-w-full overflow-hidden rounded-lg bg-slate-200">
        {!mainError && safeImages[activeIndex] ? (
          <img
            src={safeImages[activeIndex]}
            alt={alt}
            onError={() => setMainError(true)}
            className="h-full w-full max-w-full object-cover"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-slate-500">No image available</div>
        )}
      </div>
      {safeImages.length > 1 && (
        <div className="mt-3 flex w-full max-w-full gap-2 overflow-x-auto overscroll-x-contain pb-1">
          {safeImages.map((src, i) => (
            <button
              key={src}
              type="button"
              onClick={() => {
                setActiveIndex(i);
                setMainError(false);
              }}
              className={`h-14 w-16 shrink-0 overflow-hidden rounded-md border-2 sm:h-16 sm:w-20 ${
                i === activeIndex ? 'border-openlane-blue' : 'border-transparent'
              }`}
              aria-label={`View image ${i + 1}`}
            >
              <img src={src} alt="" className="h-full w-full object-cover" loading="lazy" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
