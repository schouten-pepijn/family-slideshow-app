import type { Collection } from "../../types/collection";
import type { Photo } from "../../types/photo";

type PhotoListItemProps = {
  photo: Photo;
  collections: Collection[];
  isSelected: boolean;
  onSelectPhoto: (photo: Photo) => void;
  onToggleActive: (photoId: number) => Promise<void>;
  onRemovePhoto: (photoId: number) => Promise<void>;
};

export function PhotoListItem({
  photo,
  collections,
  isSelected,
  onSelectPhoto,
  onToggleActive,
  onRemovePhoto,
}: PhotoListItemProps) {
  const photoCollections = collections.filter((collection) =>
    photo.collection_ids.includes(collection.id),
  );

  const collectionSummary =
    photoCollections.length === 0
      ? "Geen collectie"
      : photoCollections.length <= 2
        ? photoCollections.map((collection) => collection.name).join(", ")
        : `${photoCollections[0]?.name} +${photoCollections.length - 1}`;

  const formattedUpdatedAt = new Date(photo.updated_at).toLocaleDateString(
    "nl-NL",
    {
      day: "2-digit",
      month: "short",
      year: "numeric",
    },
  );

  const descriptionPreview = photo.description?.trim()
    ? photo.description.length > 120
      ? `${photo.description.slice(0, 117)}...`
      : photo.description
    : "Geen beschrijving beschikbaar.";

  return (
    <article
      className={`grid gap-4 rounded-3xl border p-4 transition-colors lg:grid-cols-[120px_minmax(0,1.5fr)_minmax(0,0.85fr)_auto] ${
        isSelected
          ? "border-white/25 bg-white/10"
          : "border-white/10 bg-black/20"
      }`}
    >
      <button
        type="button"
        onClick={() => onSelectPhoto(photo)}
        className="overflow-hidden rounded-2xl bg-black/30 text-left"
      >
        <img
          src={photo.image_url}
          alt={photo.title ?? "Foto"}
          className="h-28 w-full object-cover lg:h-full"
        />
      </button>

      <button
        type="button"
        onClick={() => onSelectPhoto(photo)}
        className="flex min-w-0 flex-col items-start gap-2 rounded-2xl border border-transparent px-2 py-1 text-left transition-colors hover:border-white/10 hover:bg-white/5"
      >
        <div className="flex flex-wrap items-center gap-2">
          <h3 className="max-w-full truncate text-lg font-semibold">
            {photo.title ?? "Zonder titel"}
          </h3>
          <span
            className={`rounded-full px-3 py-1 text-xs font-semibold ${
              photo.is_active
                ? "bg-emerald-400/20 text-emerald-100"
                : "bg-white/10 text-white/70"
            }`}
          >
            {photo.is_active ? "Actief" : "Inactief"}
          </span>
        </div>

        <p className="w-full truncate text-sm text-white/60">
          {photo.filename}
        </p>
        <p className="text-sm text-white/75">{descriptionPreview}</p>
      </button>

      <div className="grid gap-3 text-sm text-white/70 sm:grid-cols-3 lg:grid-cols-1">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-white/45">
            Collecties
          </p>
          <p className="mt-1 text-white/80">{collectionSummary}</p>
        </div>
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-white/45">
            Bijgewerkt
          </p>
          <p className="mt-1 text-white/80">{formattedUpdatedAt}</p>
        </div>
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-white/45">
            Grootte
          </p>
          <p className="mt-1 text-white/80">
            {(photo.file_size / 1024).toFixed(0)} KB
          </p>
        </div>
      </div>

      <div className="flex flex-col items-stretch gap-3 lg:items-end">
        <button
          type="button"
          onClick={() => onSelectPhoto(photo)}
          className="theme-pill-button rounded-full px-4 py-2 text-sm font-semibold"
        >
          Details
        </button>
        <button
          type="button"
          onClick={() => onToggleActive(photo.id)}
          className={`rounded-full px-4 py-2 text-sm font-semibold ${
            photo.is_active ? "theme-pill-button-active" : "theme-pill-button"
          }`}
        >
          {photo.is_active ? "Zet inactief" : "Zet actief"}
        </button>
        <button
          type="button"
          onClick={() => onRemovePhoto(photo.id)}
          className="rounded-full border border-red-400/30 bg-red-500/10 px-4 py-2 text-sm font-semibold text-red-100 transition-colors hover:bg-red-500/20"
        >
          Verwijder
        </button>
      </div>
    </article>
  );
}
