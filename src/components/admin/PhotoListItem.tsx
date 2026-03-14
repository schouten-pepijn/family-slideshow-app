import type { FormEvent } from "react";
import type { Photo } from "../../types/photo";

type PhotoListItemProps = {
  photo: Photo;
  isEditing: boolean;
  editTitle: string;
  editDescription: string;
  onEditTitleChange: (value: string) => void;
  onEditDescriptionChange: (value: string) => void;
  onStartEditing: (
    photoId: number,
    title: string | null,
    description: string | null,
  ) => void;
  onCancelEditing: () => void;
  onSavePhotoDetails: (
    event: FormEvent<HTMLFormElement>,
    photoId: number,
  ) => Promise<void>;
  onToggleActive: (photoId: number) => Promise<void>;
  onRemovePhoto: (photoId: number) => Promise<void>;
};

export function PhotoListItem({
  photo,
  isEditing,
  editTitle,
  editDescription,
  onEditTitleChange,
  onEditDescriptionChange,
  onStartEditing,
  onCancelEditing,
  onSavePhotoDetails,
  onToggleActive,
  onRemovePhoto,
}: PhotoListItemProps) {
  return (
    <article className="grid gap-4 rounded-3xl border border-white/10 bg-black/20 p-4 md:grid-cols-[180px_1fr_auto]">
      <div className="overflow-hidden rounded-2xl bg-black/30">
        <img
          src={photo.image_url}
          alt={photo.title ?? "Foto"}
          className="h-40 w-full object-cover"
        />
      </div>

      <div className="flex flex-col gap-2">
        {isEditing ? (
          <form
            onSubmit={(event) => onSavePhotoDetails(event, photo.id)}
            className="flex flex-col gap-3"
          >
            <label className="flex flex-col gap-2 text-sm font-medium text-white/80">
              Titel
              <input
                type="text"
                value={editTitle}
                onChange={(event) => onEditTitleChange(event.target.value)}
                className="rounded-2xl border border-white/15 bg-black/30 px-4 py-3 text-white placeholder:text-white/40"
              />
            </label>

            <label className="flex flex-col gap-2 text-sm font-medium text-white/80">
              Beschrijving
              <textarea
                value={editDescription}
                onChange={(event) =>
                  onEditDescriptionChange(event.target.value)
                }
                rows={4}
                className="rounded-2xl border border-white/15 bg-black/30 px-4 py-3 text-white placeholder:text-white/40"
              />
            </label>

            <div className="flex flex-wrap gap-3">
              <button
                type="submit"
                className="rounded-full bg-white px-4 py-2 text-sm font-semibold text-black transition-opacity hover:opacity-90"
              >
                Opslaan
              </button>
              <button
                type="button"
                onClick={onCancelEditing}
                className="rounded-full border border-white/15 bg-white/10 px-4 py-2 text-sm font-semibold transition-colors hover:bg-white/15"
              >
                Annuleren
              </button>
            </div>
          </form>
        ) : (
          <button
            type="button"
            onClick={() =>
              onStartEditing(photo.id, photo.title, photo.description)
            }
            className="flex flex-col items-start gap-2 rounded-2xl border border-transparent px-2 py-2 text-left transition-colors hover:border-white/10 hover:bg-white/5"
          >
            <div className="flex flex-wrap items-center gap-2">
              <h3 className="text-lg font-semibold">
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

            <p className="text-sm text-white/70">
              {photo.description ?? "Geen beschrijving beschikbaar."}
            </p>
          </button>
        )}

        <dl className="grid gap-2 text-xs text-white/50 sm:grid-cols-2">
          <div>
            <dt>Bestandsnaam</dt>
            <dd className="text-white/70">{photo.filename}</dd>
          </div>
          <div>
            <dt>Bestandsgrootte</dt>
            <dd className="text-white/70">
              {(photo.file_size / 1024).toFixed(0)} KB
            </dd>
          </div>
        </dl>
      </div>

      <div className="flex flex-col items-stretch gap-3 md:items-end">
        <button
          type="button"
          onClick={() => onToggleActive(photo.id)}
          className="rounded-full border border-white/15 bg-white/10 px-4 py-2 text-sm font-semibold transition-colors hover:bg-white/15"
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
