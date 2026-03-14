import type { Photo } from "../../types/photo";
import { useSlideshow } from "../../hooks/useSlideshow";
import { SlideshowImage } from "./SlideshowImage";

type SlideshowProps = {
  photos: Photo[];
};

export function Slideshow({ photos }: SlideshowProps) {
  const { activeIndex, activePhoto, goToNext, goToPrevious } = useSlideshow({
    photos,
    intervalMs: 8000,
  });

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
            onClick={goToPrevious}
          >
            Vorige
          </button>
          <button
            type="button"
            className="px-5 py-3 rounded-full border border-white/20 bg-white/8 text-white font-semibold cursor-pointer transition-all duration-150 hover:bg-white/14 hover:-translate-y-px active:translate-y-0"
            onClick={goToNext}
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
