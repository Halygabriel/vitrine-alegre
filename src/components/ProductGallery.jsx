import { useEffect, useRef, useState } from 'react';
import './ProductGallery.css';

export default function ProductGallery({ images, title }) {
  const safeImages = Array.isArray(images) && images.length > 0 ? images : [];
  const [selectedIndex, setSelectedIndex] = useState(0);
  const thumbRefs = useRef([]);

  useEffect(() => setSelectedIndex(0), [images]);

  const selectRelative = (index, direction) => {
    const next = (index + direction + safeImages.length) % safeImages.length;
    setSelectedIndex(next);
    thumbRefs.current[next]?.focus();
  };

  if (safeImages.length === 0) return null;

  return (
    <section className="product-gallery" aria-label={`${title} image gallery`}>
      <div className="product-gallery__main">
        <img src={safeImages[selectedIndex]} alt={`${title} view ${selectedIndex + 1}`} />
      </div>
      {safeImages.length > 1 ? (
        <div className="product-gallery__thumbnails" role="tablist" aria-label="Product images">
          {safeImages.map((image, index) => (
            <button
              ref={(element) => { thumbRefs.current[index] = element; }}
              key={`${image}-${index}`}
              type="button"
              role="tab"
              aria-selected={selectedIndex === index}
              aria-label={`Show image ${index + 1} of ${safeImages.length}`}
              className={`product-gallery__thumbnail ${selectedIndex === index ? 'product-gallery__thumbnail--active' : ''}`}
              onClick={() => setSelectedIndex(index)}
              onKeyDown={(event) => {
                if (event.key === 'ArrowRight') { event.preventDefault(); selectRelative(index, 1); }
                if (event.key === 'ArrowLeft') { event.preventDefault(); selectRelative(index, -1); }
              }}
            >
              <img src={image} alt="" />
            </button>
          ))}
        </div>
      ) : null}
    </section>
  );
}
