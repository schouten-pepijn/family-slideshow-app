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
    <div className="mx-auto w-full max-w-4xl">
      <label className="mb-2 block text-xs font-semibold uppercase tracking-[0.22em] text-white/45">
        Collectie
      </label>

      <select
        className="w-full rounded-2xl border border-white/10 bg-black/25 px-4 py-3 text-sm text-white outline-none backdrop-blur-md transition focus:border-white/25"
        value={selectedCollectionId}
        onChange={(event) => {
          const value = event.target.value;
          onSelectCollection(value === "all" ? "all" : Number(value));
        }}
      >
        <option value="all">Alle actieve foto's</option>
        {collections.map((collection) => (
          <option key={collection.id} value={collection.id}>
            {collection.name}
          </option>
        ))}
      </select>
    </div>
  );
}
