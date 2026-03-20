import {
  createElement,
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import {
  fetchCollections,
  createCollection,
  updateCollection,
  deleteCollection,
} from "../api/collections";
import type { Collection } from "../types/collection";

type UseCollectionsResult = {
  collections: Collection[];
  isLoading: boolean;
  error: string | null;
  refresh: (options?: { silent?: boolean }) => Promise<void>;
  createNewCollection: (
    name: string,
    description?: string,
    isPublic?: boolean,
    sortOrder?: number,
  ) => Promise<void>;
  editCollection: (
    collectionId: number,
    updates: {
      name?: string;
      description?: string | null;
      is_public?: boolean;
      sort_order?: number | null;
    },
  ) => Promise<void>;
  removeCollection: (collectionId: number) => Promise<void>;
};

const CollectionsContext = createContext<UseCollectionsResult | null>(null);

function useCollectionsState(): UseCollectionsResult {
  const [collections, setCollections] = useState<Collection[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function refresh(options?: { silent?: boolean }) {
    return Promise.resolve();
  }

  async function createNewCollection(
    name: string,
    description?: string,
    isPublic?: boolean,
    sortOrder?: number,
  ) {
    return Promise.resolve();
  }

  async function editCollection(
    collectionId: number,
    updates: {
      name?: string;
      description?: string | null;
      is_public?: boolean;
      sort_order?: number;
    },
  ) {
    return Promise.resolve();
  }

  async function removeCollection(collectionId: number) {
    return Promise.resolve();
  }

  return {
    collections,
    isLoading,
    error,
    refresh,
    createNewCollection,
    editCollection,
    removeCollection,
  };
}
