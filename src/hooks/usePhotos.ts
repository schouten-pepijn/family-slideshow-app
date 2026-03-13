import { useEffect, useState } from "react";
import { uploadPhoto, fetchPhotos, updatePhoto } from "../api/photos";
import type { Photo } from "../types/photo";

// Custom hook to manage photos state and actions
type UsePhotosResult = {
  photos: Photo[];
  isLoading: boolean;
  error: string | null;
  refresh: () => Promise<void>;
  addNewPhoto: (
    file: File,
    title?: string,
    description?: string,
  ) => Promise<void>;
  toggleActive: (photoId: number) => Promise<void>;
};

// This hook encapsulates the logic for fetching, adding, and updating photos,
export function usePhotos(): UsePhotosResult {
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Function to refresh the list of photos from the API
  async function refresh() {
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

  // Function to add a new photo using the API and update the local state
  async function addNewPhoto(file: File, title?: string, description?: string) {
    try {
      setError(null);
      const newPhoto = await uploadPhoto(file, title, description);
      setPhotos((currentPhotos) =>
        [...currentPhotos, newPhoto].sort(
          (a, b) => a.sort_order - b.sort_order,
        ),
      );
    } catch {
      setError("Er is een fout opgetreden bij het toevoegen van de foto.");
    }
  }

  // Function to toggle the active state of a photo and update it via the API
  async function toggleActive(photoId: number) {
    try {
      setError(null);

      const currentPhoto = photos.find((photo) => photo.id === photoId);
      if (!currentPhoto) {
        throw new Error("Photo not found");
      }

      const updatedPhoto = await updatePhoto(photoId, {
        is_active: !currentPhoto.is_active,
      });

      setPhotos((currentPhotos) =>
        currentPhotos.map((photo) =>
          photo.id === photoId ? updatedPhoto : photo,
        ),
      );
    } catch {
      setError("Er is een fout opgetreden bij het bijwerken van de foto.");
    }
  }

  // Load photos when the hook is first used
  useEffect(() => {
    refresh();
  }, []);

  return {
    photos,
    isLoading,
    error,
    refresh,
    addNewPhoto,
    toggleActive,
  };
}
