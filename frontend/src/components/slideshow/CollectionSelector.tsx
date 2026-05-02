import type { Collection } from "../../types/collection";

type CollectionSelectorProps = {
  collections: Collection[];
  selectedCollectionId: number | "all";
  onSelectCollection: (collectionId: number | "all") => void;
};

export function CollectionSelector({
  collections,
  selectedCollectionId,
  onSelectCollection,
}: CollectionSelectorProps) {
  return (
    <section className="mx-auto w-full max-w-6xl">
      <div className="overflow-x-auto">
        <div className="flex min-w-max justify-center gap-2 px-2">
          <button
            type="button"
            onClick={() => onSelectCollection("all")}
            className={`shrink-0 rounded-full px-3 py-2 text-sm font-medium whitespace-nowrap transition-all duration-150 hover:-translate-y-px ${
              selectedCollectionId === "all"
                ? "theme-pill-button-active"
                : "theme-pill-button"
            }`}
          >
            Alle actieve foto's
          </button>

          {collections.map((collection) => {
            const isSelected = selectedCollectionId === collection.id;

            return (
              <button
                key={collection.id}
                type="button"
                onClick={() => onSelectCollection(collection.id)}
                className={`shrink-0 rounded-full px-3 py-2 text-sm font-medium whitespace-nowrap transition-all duration-150 hover:-translate-y-px ${
                  isSelected ? "theme-pill-button-active" : "theme-pill-button"
                }`}
              >
                {collection.name}
              </button>
            );
          })}
        </div>
      </div>
    </section>
  );
}
