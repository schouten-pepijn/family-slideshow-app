import { useEffect, useState } from "react";
import type { Photo } from "../../types/photo";
import { SlideshowImage } from "./SlideshowImage";

type SlideshowProps = {
  photos: Photo[];
};

export function Slideshow({ photos }: SlideshowProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const activePhoto = photos[activeIndex];

  useEffect(() => {
    if (activeIndex >= photos.length) {
      setActiveIndex(0);
    }
  }, [activeIndex, photos.length]);

  useEffect(() => {
    if (photos.length <= 1) {
      return;
    }

    const timer = setInterval(() => {
      setActiveIndex((currentIndex) => (currentIndex + 1) % photos.length);
    }, 8000);

    return () => clearInterval(timer);
  }, [photos.length]);

  return (
    <div className="min-h-screen flex flex-col gap-6 p-8">
      <header className="text-center">
        <h1 className="text-2xl font-bold text-white">
          Pepijns Sample Slideshow
        </h1>
        <p className="text-white/75 mt-1">
          Gebruik de knoppen hieronder om door de foto's te bladeren, of wacht
          tot de automatische rotatie.
        </p>
      </header>

      <main className="flex flex-col items-center gap-6 max-w-[920px] w-full mx-auto">
        <SlideshowImage
          photo={activePhoto}
          currentIndex={activeIndex}
          totalPhotos={photos.length}
        />

        <div className="flex items-center gap-3">
          <button
            type="button"
            className="px-5 py-3 rounded-full border border-white/20 bg-white/8 text-white font-semibold cursor-pointer transition-all duration-150 hover:bg-white/14 hover:-translate-y-px active:translate-y-0"
            onClick={() =>
              setActiveIndex((idx) => (idx - 1 + photos.length) % photos.length)
            }
          >
            Vorige
          </button>
          <button
            type="button"
            className="px-5 py-3 rounded-full border border-white/20 bg-white/8 text-white font-semibold cursor-pointer transition-all duration-150 hover:bg-white/14 hover:-translate-y-px active:translate-y-0"
            onClick={() => setActiveIndex((idx) => (idx + 1) % photos.length)}
          >
            Volgende
          </button>
        </div>
      </main>

      <footer className="text-center text-white/75 text-[0.9rem]">
        <p>Vervang deze voorbeeldslideshow door uw eigen gegevens en lay-out.</p>
      </footer>
    </div>
  );
}
