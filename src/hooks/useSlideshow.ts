import { useEffect, useState } from "react";
import type { Photo } from "../types/photo";

type UseSlideshowOptions = {
  photos: Photo[];
  intervalMs?: number;
};

type UseSlideshowResult = {
  activeIndex: number;
  activePhoto: Photo;
  goToNext: () => void;
  goToPrevious: () => void;
};

export function useSlideshow({
  photos,
  intervalMs = 8000,
}: UseSlideshowOptions): UseSlideshowResult {
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
    }, intervalMs);

    return () => clearInterval(timer);
  }, [intervalMs, photos.length]);

  function goToNext() {
    setActiveIndex((currentIndex) => (currentIndex + 1) % photos.length);
  }

  function goToPrevious() {
    setActiveIndex((currentIndex) =>
      (currentIndex - 1 + photos.length) % photos.length,
    );
  }

  return {
    activeIndex,
    activePhoto,
    goToNext,
    goToPrevious,
  };
}
