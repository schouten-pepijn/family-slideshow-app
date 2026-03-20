import type { Collection } from "../types/collection";
import { buildApiUrl } from "../lib/api";

export async function fetchCollections(): Promise<Collection[]> {
  const res = await fetch(buildApiUrl("/api/collections"), {
    credentials: "include",
  });

  if (!res.ok) throw new Error("Collecties ophalen mislukt.");

  return (await res.json()) as Collection[];
}

type CreateCollectionInput = {
  name: string;
  description?: string;
  is_public?: boolean;
  sort_order?: number;
};

type UpdateCollectionInput = Partial<CreateCollectionInput>;

export async function createCollection(
  input: CreateCollectionInput,
): Promise<Collection> {
  const res = await fetch(buildApiUrl("/api/collections"), {
    method: "POST",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(input),
  });

  if (!res.ok) {
    const data = await res.json().catch(() => null);
    throw new Error(data?.detail ?? "Collectie aanmaken mislukt.");
  }

  return (await res.json()) as Collection;
}

export async function updateCollection(
  collectionId: number,
  updates: UpdateCollectionInput,
): Promise<Collection> {
  const res = await fetch(buildApiUrl(`/api/collections/${collectionId}`), {
    method: "PATCH",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(updates),
  });

  if (!res.ok) {
    const data = await res.json().catch(() => null);
    throw new Error(data?.detail ?? "Collectie bijwerken mislukt.");
  }

  return (await res.json()) as Collection;
}

export async function deleteCollection(collectionId: number): Promise<void> {
  const res = await fetch(buildApiUrl(`/api/collections/${collectionId}`), {
    method: "DELETE",
    credentials: "include",
  });

  if (!res.ok) {
    const data = await res.json().catch(() => null);
    throw new Error(data?.detail ?? "Collectie verwijderen mislukt.");
  }
}
