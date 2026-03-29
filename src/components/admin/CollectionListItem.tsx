import type { Collection } from "../../types/collection";

type CollectionListItemProps = {
  collection: Collection;
  isEditing: boolean;
  onStartEditing: (
    collectionId: number,
    name: string,
    description: string | null,
    isPublic: boolean,
  ) => void;
  onRemoveCollection: (collectionId: number) => Promise<void>;
};

export function CollectionListItem({
  collection,
  isEditing,
  onStartEditing,
  onRemoveCollection,
}: CollectionListItemProps) {
  return (
    <article className="flex flex-col gap-4 rounded-3xl border border-white/10 bg-black/20 p-5 sm:flex-row sm:items-start sm:justify-between">
      <div className="flex flex-col gap-2">
        <div className="flex flex-wrap items-center gap-2">
          <h3 className="text-lg font-semibold">{collection.name}</h3>
          <span
            className={`rounded-full px-3 py-1 text-xs font-semibold ${
              collection.is_public
                ? "bg-emerald-400/20 text-emerald-100"
                : "bg-white/10 text-white/70"
            }`}
          >
            {collection.is_public ? "Publiek" : "Alleen admin"}
          </span>
        </div>

        <p className="text-sm text-white/70">
          {collection.description ?? "Geen beschrijving beschikbaar."}
        </p>

        <dl className="grid gap-2 text-xs text-white/50 sm:grid-cols-2">
          <div>
            <dt>Sortering</dt>
            <dd className="text-white/70">{collection.sort_order}</dd>
          </div>
          <div>
            <dt>Foto's</dt>
            <dd className="text-white/70">
              {collection.photo_count ?? collection.photo_ids?.length ?? 0}
            </dd>
          </div>
        </dl>
      </div>

      <div className="flex flex-col gap-3 sm:items-end">
        <button
          type="button"
          onClick={() =>
            onStartEditing(
              collection.id,
              collection.name,
              collection.description,
              collection.is_public,
            )
          }
          className={`rounded-full px-4 py-2 text-sm font-semibold ${
            isEditing ? "theme-pill-button-active" : "theme-pill-button"
          }`}
        >
          {isEditing ? "Wordt bewerkt" : "Bewerken"}
        </button>

        <button
          type="button"
          onClick={() => onRemoveCollection(collection.id)}
          className="rounded-full border border-red-400/30 bg-red-500/10 px-4 py-2 text-sm font-semibold text-red-100 transition-colors hover:bg-red-500/20"
        >
          Verwijder
        </button>
      </div>
    </article>
  );
}
