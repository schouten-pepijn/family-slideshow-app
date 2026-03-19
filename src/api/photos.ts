import type { Photo } from "../types/photo";

export async function fetchPhotos(): Promise<Photo[]> {
  const res = await fetch("/api/photos", {
    credentials: "include",
  });

  if (!res.ok) {
    throw new Error("Foto's ophalen mislukt.");
  }

  return res.json();
}

export async function uploadPhoto(
  file: File,
  title?: string,
  description?: string,
): Promise<Photo> {
  const formData = new FormData();
  formData.append("file", file);

  if (title?.trim())
    formData.append("title", title.trim());

  if (description?.trim())
    formData.append("description", description.trim());

  const res = await fetch("/api/photos/upload", {
    method: "POST",
    credentials: "include",
    body: formData,
  });

  if (!res.ok) {
    const data = await res.json().catch(() => null);
    throw new Error(data?.detail ?? "Foto uploaden mislukt.");
  }

  return res.json();
}

export async function updatePhoto(
  photoId: number,
  updates: Partial<Pick<Photo, "title" | "description" | "is_active">>,
): Promise<Photo> {
  const res = await fetch(`/api/photos/${photoId}`, {
    method: "PATCH",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(updates),
  });

  if (!res.ok) {
    const data = await res.json().catch(() => null);
    throw new Error(data?.detail ?? "Foto bijwerken mislukt.");
  }

  return res.json();
}

export async function deletePhoto(photoId: number): Promise<void> {
  const res = await fetch(`/api/photos/${photoId}`, {
    method: "DELETE",
    credentials: "include",
  });

  if (!res.ok) {
    const data = await res.json().catch(() => null);
    throw new Error(data?.detail ?? "Foto verwijderen mislukt.");
  }
}
