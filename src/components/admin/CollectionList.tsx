import type { Collection } from "../../types/collection";
import { CollectionListItem } from "./CollectionListItem";

type CollectionListProps = {
  collections: Collection[];
  editingCollectionId: number | null;
  onStartEditing: (
    collectionId: number,
    name: string,
    description: string | null,
    isPublic: boolean,
  ) => void;
  onRemoveCollection: (collectionId: number) => Promise<void>;
};

export function CollectionList({
  collections,
  editingCollectionId,
  onStartEditing,
  onRemoveCollection,
}: CollectionListProps) {
  return (
    <div className="grid gap-4">
      {collections.map((collection) => (
        <CollectionListItem
          key={collection.id}
          collection={collection}
          isEditing={editingCollectionId === collection.id}
          onStartEditing={onStartEditing}
          onRemoveCollection={onRemoveCollection}
        />
      ))}
    </div>
  );
}
