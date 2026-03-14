import {
  createElement,
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import {
  uploadPhoto,
  fetchPhotos,
  updatePhoto,
  deletePhoto,
} from "../api/photos";
import type { Photo } from "../types/photo";

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
  removePhoto: (photoId: number) => Promise<void>;
};

const PhotosContext = createContext<UsePhotosResult | null>(null);

function usePhotosState(): UsePhotosResult {
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function refresh(options?: { silent?: boolean }) {
    try {
      if (options?.silent) setIsRefreshing(true);
      else setIsLoading(true);

      setError(null);
      const data = await fetchPhotos();
      setPhotos(data);
    } catch {
      setError("Er is een fout opgetreden bij het laden van de foto's.");
    } finally {
      if (options?.silent) setIsRefreshing(false);
      else setIsLoading(false);
    }
  }

  async function addNewPhoto(file: File, title?: string, description?: string) {
    try {
      setError(null);
      await uploadPhoto(file, title, description);
      await refresh({ silent: true });
    } catch {
      setError("Er is een fout opgetreden bij het toevoegen van de foto.");
    }
  }

  async function toggleActive(photoId: number) {
    try {
      setError(null);

      const currentPhoto = photos.find((photo) => photo.id === photoId);
      if (!currentPhoto) {
        throw new Error("Photo not found");
      }

      await updatePhoto(photoId, {
        is_active: !currentPhoto.is_active,
      });
      await refresh({ silent: true });
    } catch {
      setError("Er is een fout opgetreden bij het bijwerken van de foto.");
    }
  }

  async function removePhoto(photoId: number) {
    try {
      setError(null);
      await deletePhoto(photoId);
      await refresh({ silent: true });
    } catch {
      setError("Er is een fout opgetreden bij het verwijderen van de foto.");
    }
  }

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
    removePhoto,
  };
}

type PhotosProviderProps = {
  children: ReactNode;
};

export function PhotosProvider({ children }: PhotosProviderProps) {
  const value = usePhotosState();

  return createElement(PhotosContext.Provider, { value }, children);
}

export function usePhotos(): UsePhotosResult {
  const context = useContext(PhotosContext);

  if (!context) {
    throw new Error("usePhotos must be used within a PhotosProvider");
  }

  return context;
}
