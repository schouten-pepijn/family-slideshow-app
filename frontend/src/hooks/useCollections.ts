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
import { useAuth } from "./useAuth";
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
      sort_order?: number;
    },
  ) => Promise<void>;
  removeCollection: (collectionId: number) => Promise<void>;
};

const CollectionsContext = createContext<UseCollectionsResult | null>(null);

function useCollectionsState(): UseCollectionsResult {
  const { isAuthenticated, isLoading: isAuthLoading } = useAuth();
  const [collections, setCollections] = useState<Collection[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function refresh(options?: { silent?: boolean }) {
    if (!isAuthenticated) {
      setCollections([]);
      setError(null);
      setIsLoading(false);
      setIsRefreshing(false);
      return;
    }

    try {
      if (options?.silent) setIsRefreshing(true);
      else setIsLoading(true);

      setError(null);
      const data = await fetchCollections();
      setCollections(data);
    } catch {
      setError("Er is een fout opgetreden bij het laden van de collecties.");
    } finally {
      if (options?.silent) setIsRefreshing(false);
      else setIsLoading(false);
    }
  }

  async function createNewCollection(
    name: string,
    description?: string,
    isPublic?: boolean,
    sortOrder?: number,
  ) {
    try {
      setError(null);

      await createCollection({
        name: name.trim(),
        description: description?.trim() || null,
        is_public: isPublic,
        sort_order: sortOrder,
      });
      await refresh({ silent: true });
    } catch {
      setError("Er is een fout opgetreden bij het aanmaken van de collectie.");
    }
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
    try {
      setError(null);

      await updateCollection(collectionId, {
        ...updates,
        name: updates.name?.trim(),
        description:
          updates.description === undefined
            ? undefined
            : updates.description?.trim() || null,
      });

      await refresh({ silent: true });
    } catch {
      setError("Er is een fout opgetreden bij het bijwerken van de collectie.");
    }
  }

  async function removeCollection(collectionId: number) {
    try {
      setError(null);

      await deleteCollection(collectionId);
      await refresh({ silent: true });
    } catch {
      setError("Er is een fout opgetreden bij het verwijderen van de collectie.");
    }
  }

  useEffect(() => {
    if (isAuthLoading) {
      return;
    }

    if (!isAuthenticated) {
      setCollections([]);
      setError(null);
      setIsLoading(false);
      return;
    }

    void refresh();
  }, [isAuthenticated, isAuthLoading]);

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

type CollectionsProviderProps = {
  children: ReactNode;
};

export function CollectionsProvider({ children }: CollectionsProviderProps) {
  const value = useCollectionsState();

  return createElement(CollectionsContext.Provider, { value }, children);
}

export function useCollections(): UseCollectionsResult {
  const context = useContext(CollectionsContext);

  if (!context) {
    throw new Error("useCollections must be used within a CollectionsProvider");
  }

  return context;
}
