import { useEffect, useRef, useState, type ReactNode } from "react";
import type { Photo } from "../../types/photo";
import { useSlideshow } from "../../hooks/useSlideshow";
import { SlideshowImage } from "./SlideshowImage";

type SlideshowProps = {
  photos: Photo[];
  headerContent?: ReactNode;
};

export function Slideshow({ photos, headerContent }: SlideshowProps) {
  const { activeIndex, activePhoto, goToNext, goToPrevious } = useSlideshow({
    photos,
    intervalMs: 12000,
  });
  const slideshowRef = useRef<HTMLDivElement | null>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);

  useEffect(() => {
    if (photos.length <= 1) {
      return;
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "ArrowLeft") {
        goToPrevious();
      }

      if (event.key === "ArrowRight") {
        goToNext();
      }
    }

    window.addEventListener("keydown", handleKeyDown);

    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [goToNext, goToPrevious, photos.length]);

  useEffect(() => {
    function handleFullscreenChange() {
      setIsFullscreen(document.fullscreenElement === slideshowRef.current);
    }

    document.addEventListener("fullscreenchange", handleFullscreenChange);

    return () =>
      document.removeEventListener("fullscreenchange", handleFullscreenChange);
  }, []);

  async function handleToggleFullscreen() {
    if (!document.fullscreenElement) {
      await slideshowRef.current?.requestFullscreen();
      return;
    }

    if (document.fullscreenElement === slideshowRef.current) {
      await document.exitFullscreen();
    }
  }

  return (
    <div
      ref={slideshowRef}
      className={
        isFullscreen
          ? "theme-fullscreen-bg min-h-[100svh] w-screen p-0 text-white"
          : "theme-page min-h-screen px-3 pt-36 pb-8 text-white sm:px-6 sm:pt-24 lg:px-8"
      }
    >
      <div
        className={`flex w-full flex-col ${
          isFullscreen ? "max-w-none" : "mx-auto max-w-7xl gap-6"
        }`}
      >
        {!isFullscreen && (
          <header className="flex flex-col gap-3 text-center">
            <p className="text-xs font-semibold uppercase tracking-[0.28em] text-white/45">
              Digitale fotolijst
            </p>
            <h1 className="display-page-title text-3xl font-semibold sm:text-5xl">
              Onze leukste herinneringen
            </h1>
            <p className="mx-auto max-w-2xl text-sm leading-7 text-white/65 sm:text-base">
              Laat automatisch doorlopen of navigeer met de pijltjestoetsen of de knoppen.
            </p>

            {headerContent && <div className="pt-1">{headerContent}</div>}
          </header>
        )}

        <main
          className={`mx-auto flex w-full flex-col items-center ${
            isFullscreen ? "max-w-none gap-0" : "max-w-6xl gap-6"
          }`}
        >
          <SlideshowImage
            photo={activePhoto}
            currentIndex={activeIndex}
            totalPhotos={photos.length}
            showCaption={true}
            showCounter={!isFullscreen}
            fullscreen={isFullscreen}
          />

          {!isFullscreen && (
            <div className="flex w-full max-w-xl flex-col items-center gap-3">
              <div className="grid w-full grid-cols-2 gap-2 sm:flex sm:flex-wrap sm:items-center sm:justify-center sm:gap-3">
                {photos.length > 1 && (
                  <>
                    <button
                      type="button"
                      className="theme-pill-button min-h-11 rounded-full px-5 py-3 text-sm font-semibold transition-all duration-150 hover:-translate-y-px active:translate-y-0"
                      onClick={goToPrevious}
                    >
                      Vorige
                    </button>
                    <button
                      type="button"
                      className="theme-pill-button min-h-11 rounded-full px-5 py-3 text-sm font-semibold transition-all duration-150 hover:-translate-y-px active:translate-y-0"
                      onClick={goToNext}
                    >
                      Volgende
                    </button>
                  </>
                )}

                <button
                  type="button"
                  className="theme-pill-button col-span-2 min-h-11 rounded-full px-5 py-3 text-sm font-semibold transition-all duration-150 hover:-translate-y-px active:translate-y-0 sm:col-span-1"
                  onClick={handleToggleFullscreen}
                >
                  Volledig scherm
                </button>
              </div>

              {photos.length > 1 && (
                <p className="text-xs uppercase tracking-[0.22em] text-white/40">
                  Automatische wissel elke 12 seconden
                </p>
              )}

              {photos.length === 1 && (
                <p className="text-xs uppercase tracking-[0.22em] text-white/40">
                  Een actieve foto in de fotolijst
                </p>
              )}
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
