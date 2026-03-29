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
    <section className="mx-auto w-full max-w-4xl rounded-[1.5rem] border border-white/10 bg-black/18 px-3 py-3 shadow-[0_16px_40px_rgba(0,0,0,0.2)] backdrop-blur-md sm:px-4">
      <div className="flex items-center justify-between gap-3">
        <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-white/45">
          Collectie
        </p>
        <p className="text-xs text-white/45">
          {collections.length + 1} filters
        </p>
      </div>

      <div className="mt-3 overflow-x-auto pb-1">
        <div className="flex min-w-max gap-2">
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
