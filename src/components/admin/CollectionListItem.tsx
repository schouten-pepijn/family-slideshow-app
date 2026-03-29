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
  const photoCount =
    collection.photo_count ?? collection.photo_ids?.length ?? 0;
  const descriptionPreview = collection.description?.trim()
    ? collection.description.length > 110
      ? `${collection.description.slice(0, 107)}...`
      : collection.description
    : "Geen beschrijving beschikbaar.";
  const formattedUpdatedAt = new Date(collection.updated_at).toLocaleDateString(
    "nl-NL",
    {
      day: "2-digit",
      month: "short",
      year: "numeric",
    },
  );

  return (
    <article
      className={`grid gap-4 rounded-3xl border p-4 transition-colors lg:grid-cols-[minmax(0,1.6fr)_minmax(0,0.9fr)_auto] ${
        isEditing
          ? "border-white/25 bg-white/10"
          : "border-white/10 bg-black/20"
      }`}
    >
      <div className="min-w-0">
        <div className="flex flex-wrap items-center gap-2">
          <h3 className="truncate text-lg font-semibold">{collection.name}</h3>
          <span
            className={`rounded-full px-2 py-0.5 text-[0.65rem] font-semibold uppercase tracking-wide ${
              collection.is_public
                ? "bg-emerald-400/20 text-emerald-100"
                : "bg-white/10 text-white/60"
            }`}
          >
            {collection.is_public ? "Publiek" : "Alleen admin"}
          </span>
        </div>

        <p className="mt-2 text-sm text-white/70">{descriptionPreview}</p>
      </div>

      <dl className="grid gap-3 text-sm text-white/70 sm:grid-cols-3 lg:grid-cols-1">
        <div>
          <dt className="text-xs font-semibold uppercase tracking-[0.14em] text-white/45">
            Foto's
          </dt>
          <dd className="mt-1 text-white/80">{photoCount}</dd>
        </div>
        <div>
          <dt className="text-xs font-semibold uppercase tracking-[0.14em] text-white/45">
            Sortering
          </dt>
          <dd className="mt-1 text-white/80">{collection.sort_order}</dd>
        </div>
        <div>
          <dt className="text-xs font-semibold uppercase tracking-[0.14em] text-white/45">
            Bijgewerkt
          </dt>
          <dd className="mt-1 text-white/80">{formattedUpdatedAt}</dd>
        </div>
      </dl>

      <div className="flex flex-col gap-3 lg:items-end">
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
          className={`rounded-full px-3 py-1.5 text-xs font-semibold ${
            isEditing ? "theme-pill-button-active" : "theme-pill-button"
          }`}
        >
          {isEditing ? "Wordt bewerkt" : "Bewerken"}
        </button>

        <button
          type="button"
          onClick={() => onRemoveCollection(collection.id)}
          className="rounded-full border border-red-400/30 bg-red-500/10 px-3 py-1.5 text-xs font-semibold text-red-100 transition-colors hover:bg-red-500/20"
        >
          Verwijder
        </button>
      </div>
    </article>
  );
}
