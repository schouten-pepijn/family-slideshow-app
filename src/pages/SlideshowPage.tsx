import { useEffect, useMemo, useState } from "react";
import { fetchPhotos } from "../api/photos";
import { Slideshow } from "../components/slideshow/Slideshow";
import { SlideshowEmptyState } from "../components/slideshow/SlideshowEmptyState";
import type { Photo } from "../types/photo";

export function SlideshowPage() {
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadPhotos() {
      try {
        setIsLoading(true);
        setError(null);
        const data = await fetchPhotos();
        setPhotos(data);
      } catch {
        setError("Er is een fout opgetreden bij het laden van de foto's.");
      } finally {
        setIsLoading(false);
      }
    }

    loadPhotos();
  }, []);

  const activePhotos = useMemo(
    () => photos.filter((photo) => photo.is_active),
    [photos],
  );

  if (isLoading) {
    return <div className="min-h-screen p-8 text-white">Foto's laden...</div>;
  }

  if (error) {
    return <div className="min-h-screen p-8 text-white">{error}</div>;
  }

  if (activePhotos.length === 0) {
    return <SlideshowEmptyState />;
  }

  return <Slideshow photos={activePhotos} />;
}
