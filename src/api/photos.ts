import type { Photo } from "../types/photo";
import { buildApiUrl, resolveAssetUrl } from "../lib/api";

function normalizePhoto(photo: Photo): Photo {
  return {
    ...photo,
    image_url: resolveAssetUrl(photo.image_url),
  };
}

export async function fetchPhotos(): Promise<Photo[]> {
  const res = await fetch(buildApiUrl("/api/photos"), {
    credentials: "include",
  });

  if (!res.ok) {
    throw new Error("Foto's ophalen mislukt.");
  }

  const photos = (await res.json()) as Photo[];
  return photos.map(normalizePhoto);
}

export async function uploadPhoto(
  file: File,
  title?: string,
  description?: string,
  collection_ids?: number[],
): Promise<Photo> {
  const formData = new FormData();
  formData.append("file", file);

  if (title?.trim()) formData.append("title", title.trim());

  if (description?.trim()) formData.append("description", description.trim());

  if (collection_ids?.length) {
    collection_ids.forEach((id) =>
      formData.append("collection_ids", id.toString()),
    );
  }

  const res = await fetch(buildApiUrl("/api/photos/upload"), {
    method: "POST",
    credentials: "include",
    body: formData,
  });

  if (!res.ok) {
    const data = await res.json().catch(() => null);
    throw new Error(data?.detail ?? "Foto uploaden mislukt.");
  }

  return normalizePhoto((await res.json()) as Photo);
}

export async function updatePhoto(
  photoId: number,
  updates: Partial<Pick<Photo, "title" | "description" | "is_active">>,
): Promise<Photo> {
  const res = await fetch(buildApiUrl(`/api/photos/${photoId}`), {
    method: "PATCH",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(updates),
  });

  if (!res.ok) {
    const data = await res.json().catch(() => null);
    throw new Error(data?.detail ?? "Foto bijwerken mislukt.");
  }

  return normalizePhoto((await res.json()) as Photo);
}

export async function deletePhoto(photoId: number): Promise<void> {
  const res = await fetch(buildApiUrl(`/api/photos/${photoId}`), {
    method: "DELETE",
    credentials: "include",
  });

  if (!res.ok) {
    const data = await res.json().catch(() => null);
    throw new Error(data?.detail ?? "Foto verwijderen mislukt.");
  }
}
