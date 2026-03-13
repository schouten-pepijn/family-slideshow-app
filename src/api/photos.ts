import type { Photo } from "../types/photo";
import { mockPhotos } from "../mocks/photos";

// In-memory store for photos, initialized with mock data. This simulates a backend data source for the photos.
let photoStore: Photo[] = [...mockPhotos];

// Utility function to simulate a delay, mimicking network latency when fetching photos from an API.
const wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

// Asynchronous function to fetch photos from the in-memory store. It simulates a network request by introducing a delay before returning the sorted list of photos based on their sort_order.
export async function fetchPhotos(): Promise<Photo[]> {
  await wait(200); // Simulate network delay
  return [...photoStore].sort((a, b) => a.sort_order - b.sort_order);
}

// Asynchronous function to add a new photo to the in-memory store. It takes a File object and optional title and description parameters. The function simulates a network request by introducing a delay before creating a new Photo object, adding it to the store, and returning the newly added photo.
export async function addPhoto(
  file: File,
  title?: string,
  description?: string,
): Promise<Photo> {
  await wait(200); // Simulate network delay

  const now = new Date().toISOString();
  const nextId = Math.max(0, ...photoStore.map((p) => p.id)) + 1;

  const newPhoto: Photo = {
    id: nextId,
    filename: file.name,
    stored_filename: file.name,
    mime_type: file.type || "image/jpeg",
    file_size: file.size,
    title: title?.trim() || null,
    description: description?.trim() || null,
    is_active: true,
    sort_order: photoStore.length + 1,
    created_at: now,
    updated_at: now,
    image_url: URL.createObjectURL(file),
  };

  photoStore = [...photoStore, newPhoto];
  return newPhoto;
}

// Asynchronous function to update a photo's details in the in-memory store. It takes a photoId and an object containing the fields to be updated (title, description, is_active). The function simulates a network request by introducing a delay before updating the photo and returning the updated photo object.
export async function updatePhoto(
  photoId: number,
  updates: Partial<Pick<Photo, "title" | "description" | "is_active">>,
): Promise<Photo> {
  await wait(200); // Simulate network delay

  const photo = photoStore.find((item) => item.id === photoId);
  if (!photo) {
    throw new Error("Photo not found");
  }

  const updatedPhoto: Photo = {
    ...photo,
    ...updates,
    updated_at: new Date().toISOString(),
  };

  photoStore = photoStore.map((item) =>
    item.id === photoId ? updatedPhoto : item,
  );

  return updatedPhoto;
}
