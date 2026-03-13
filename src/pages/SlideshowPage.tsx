import { useMemo } from "react";
import { Slideshow } from "../components/slideshow/Slideshow";
import { SlideshowEmptyState } from "../components/slideshow/SlideshowEmptyState";
import { usePhotos } from "../hooks/usePhotos";

// This page component is responsible for displaying the slideshow of active photos.
export function SlideshowPage() {
  const { photos, isLoading, error } = usePhotos();

  // Memoize the list of active photos to avoid unnecessary computations on re-renders. It filters the photos to include only those that are marked as active.
  const activePhotos = useMemo(
    () => photos.filter((photo) => photo.is_active),
    [photos],
  );

  // Conditional rendering based on the loading state, error state, and the presence of active photos. It displays a loading message while photos are being fetched, an error message if there was an issue fetching the photos, an empty state if there are no active photos, or the slideshow component if there are active photos to display.
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
