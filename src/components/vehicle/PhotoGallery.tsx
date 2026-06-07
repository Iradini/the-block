import { useState } from 'react'

interface PhotoGalleryProps {
  images: string[]
  alt: string
}

export function PhotoGallery({ images, alt }: PhotoGalleryProps) {
  const [activeIndex, setActiveIndex] = useState(0)
  const [erroredIndices, setErroredIndices] = useState<Set<number>>(new Set())

  function handleError(index: number) {
    setErroredIndices((prev) => new Set(prev).add(index))
  }

  function handleKeyDown(e: React.KeyboardEvent, index: number) {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault()
      setActiveIndex(index)
    }
  }

  const activeImageSrc = erroredIndices.has(activeIndex) ? null : (images[activeIndex] ?? null)
  const showThumbnails = images.length > 1

  return (
    <div className="space-y-2">
      {/* Main image */}
      <div className="relative aspect-[4/3] rounded-xl overflow-hidden bg-gray-100">
        {activeImageSrc ? (
          <img
            key={activeIndex}
            src={activeImageSrc}
            alt={`${alt} — photo ${activeIndex + 1} of ${images.length}`}
            className="absolute inset-0 w-full h-full object-cover"
            onError={() => handleError(activeIndex)}
          />
        ) : (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 text-gray-300">
            <svg className="w-16 h-16" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1}
                d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
            <span className="text-sm">Photo unavailable</span>
          </div>
        )}
      </div>

      {/* Thumbnails */}
      {showThumbnails && (
        <div className="flex gap-2 overflow-x-auto pb-1" role="list" aria-label="Photo thumbnails">
          {images.map((img, i) => (
            <button
              key={i}
              role="listitem"
              onClick={() => setActiveIndex(i)}
              onKeyDown={(e) => handleKeyDown(e, i)}
              className={`flex-shrink-0 w-16 h-12 rounded-lg overflow-hidden border-2 transition-all focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                i === activeIndex
                  ? 'border-blue-500 ring-1 ring-blue-500'
                  : 'border-transparent hover:border-gray-300'
              }`}
              aria-label={`View photo ${i + 1}`}
              aria-pressed={i === activeIndex}
            >
              {erroredIndices.has(i) ? (
                <div className="w-full h-full bg-gray-100" />
              ) : (
                <img
                  src={img}
                  alt=""
                  className="w-full h-full object-cover"
                  onError={() => handleError(i)}
                />
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
