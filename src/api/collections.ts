import type { Collection } from "../types/collection";
import { buildApiUrl } from "../lib/api";

async function fetchCollections(): Promise<Collection[]> {
  const res = await fetch(buildApiUrl("/api/collections"), {
    credentials: "include",
  });

  if (!res.ok) throw new Error("Collecties ophalen mislukt.");

  return (await res.json()) as Collection[];
}
