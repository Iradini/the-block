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
    <div className="space-y-3">
      <div className="aspect-[4/3] overflow-hidden rounded-xl bg-slate-200">
        {!mainError && safeImages[activeIndex] ? (
          <img
            src={safeImages[activeIndex]}
            alt={alt}
            onError={() => setMainError(true)}
            className="h-full w-full object-cover"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-slate-500">No image available</div>
        )}
      </div>
      {safeImages.length > 1 && (
        <div className="flex gap-2 overflow-x-auto pb-1">
          {safeImages.map((src, i) => (
            <button
              key={src}
              type="button"
              onClick={() => {
                setActiveIndex(i);
                setMainError(false);
              }}
              className={`h-16 w-20 shrink-0 overflow-hidden rounded-lg border-2 ${
                i === activeIndex ? 'border-[#1a1a2e]' : 'border-transparent'
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
