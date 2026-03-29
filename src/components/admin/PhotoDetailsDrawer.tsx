import type { FormEvent } from "react";

import type { Collection } from "../../types/collection";
import type { Photo } from "../../types/photo";

type PhotoDetailsDrawerProps = {
  photo: Photo | null;
  collections: Collection[];
  editTitle: string;
  editDescription: string;
  editCollectionIds: number[];
  onEditTitleChange: (value: string) => void;
  onEditDescriptionChange: (value: string) => void;
  onEditCollectionIdsChange: (value: number[]) => void;
  onClose: () => void;
  onSavePhotoDetails: (
    event: FormEvent<HTMLFormElement>,
    photoId: number,
  ) => Promise<void>;
  onToggleActive: (photoId: number) => Promise<void>;
  onRemovePhoto: (photoId: number) => Promise<void>;
};

export function PhotoDetailsDrawer({
  photo,
  collections,
  editTitle,
  editDescription,
  editCollectionIds,
  onEditTitleChange,
  onEditDescriptionChange,
  onEditCollectionIdsChange,
  onClose,
  onSavePhotoDetails,
  onToggleActive,
  onRemovePhoto,
}: PhotoDetailsDrawerProps) {
  if (!photo) {
    return null;
  }

  function handleToggleCollection(collectionId: number) {
    onEditCollectionIdsChange(
      editCollectionIds.includes(collectionId)
        ? editCollectionIds.filter((id) => id !== collectionId)
        : [...editCollectionIds, collectionId],
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/55 p-3 sm:p-6">
      <div className="absolute inset-0" aria-hidden="true" onClick={onClose} />

      <aside className="theme-shell relative z-10 flex h-full w-full max-w-3xl flex-col overflow-hidden rounded-[2rem] border shadow-[0_30px_120px_rgba(0,0,0,0.5)] backdrop-blur-xl">
        <div className="flex items-start justify-between gap-4 border-b border-white/10 px-5 py-5 sm:px-6">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-white/45">
              Foto details
            </p>
            <h3 className="mt-2 text-2xl font-semibold text-white">
              {photo.title ?? "Zonder titel"}
            </h3>
            <p className="mt-1 text-sm text-white/60">{photo.filename}</p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="theme-pill-button rounded-full px-4 py-2 text-sm font-semibold"
          >
            Sluit
          </button>
        </div>

        <div className="grid flex-1 gap-6 overflow-y-auto p-5 lg:grid-cols-[240px_minmax(0,1fr)] lg:p-6">
          <div className="space-y-4">
            <div className="overflow-hidden rounded-[1.5rem] border border-white/10 bg-black/30">
              <img
                src={photo.image_url}
                alt={photo.title ?? "Foto"}
                className="h-72 w-full object-cover"
              />
            </div>

            <div className="rounded-[1.5rem] border border-white/10 bg-black/20 p-4 text-sm text-white/70">
              <dl className="grid gap-3">
                <div>
                  <dt className="text-xs font-semibold uppercase tracking-[0.14em] text-white/45">
                    Bestand
                  </dt>
                  <dd className="mt-1 break-all text-white/80">
                    {photo.filename}
                  </dd>
                </div>
                <div>
                  <dt className="text-xs font-semibold uppercase tracking-[0.14em] text-white/45">
                    Grootte
                  </dt>
                  <dd className="mt-1 text-white/80">
                    {(photo.file_size / 1024).toFixed(0)} KB
                  </dd>
                </div>
                <div>
                  <dt className="text-xs font-semibold uppercase tracking-[0.14em] text-white/45">
                    Bijgewerkt
                  </dt>
                  <dd className="mt-1 text-white/80">
                    {new Date(photo.updated_at).toLocaleString("nl-NL")}
                  </dd>
                </div>
              </dl>
            </div>
          </div>

          <form
            onSubmit={(event) => onSavePhotoDetails(event, photo.id)}
            className="flex flex-col gap-4"
          >
            <div className="grid gap-4 sm:grid-cols-2">
              <label className="flex flex-col gap-2 text-sm font-medium text-white/80 sm:col-span-2">
                Titel
                <input
                  type="text"
                  value={editTitle}
                  onChange={(event) => onEditTitleChange(event.target.value)}
                  className="rounded-2xl border border-white/15 bg-black/30 px-4 py-3 text-white placeholder:text-white/40"
                  placeholder="Bijvoorbeeld: Zomerdag in de tuin"
                />
              </label>

              <label className="flex flex-col gap-2 text-sm font-medium text-white/80 sm:col-span-2">
                Beschrijving
                <textarea
                  value={editDescription}
                  onChange={(event) =>
                    onEditDescriptionChange(event.target.value)
                  }
                  rows={4}
                  className="rounded-2xl border border-white/15 bg-black/30 px-4 py-3 text-white placeholder:text-white/40"
                  placeholder="Korte toelichting bij de foto"
                />
              </label>
            </div>

            {collections.length > 0 && (
              <fieldset className="rounded-[1.5rem] border border-white/10 bg-black/20 p-4">
                <legend className="px-2 text-sm font-semibold text-white/80">
                  Collecties
                </legend>
                <div className="mt-3 grid gap-2 sm:grid-cols-2">
                  {collections.map((collection) => {
                    const isSelected = editCollectionIds.includes(
                      collection.id,
                    );

                    return (
                      <label
                        key={collection.id}
                        className={`flex items-start gap-3 rounded-2xl border px-3 py-3 text-sm transition-colors ${
                          isSelected
                            ? "border-white/25 bg-white/10 text-white"
                            : "border-white/10 bg-black/20 text-white/80 hover:bg-white/5"
                        }`}
                      >
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={() => handleToggleCollection(collection.id)}
                          className="mt-0.5"
                        />
                        <span className="flex flex-col gap-1">
                          <span className="font-medium">{collection.name}</span>
                          <span className="text-xs text-white/55">
                            {collection.description ??
                              "Geen beschrijving beschikbaar."}
                          </span>
                        </span>
                      </label>
                    );
                  })}
                </div>
              </fieldset>
            )}

            <div className="mt-auto flex flex-wrap gap-3 border-t border-white/10 pt-4">
              <button
                type="submit"
                className="theme-pill-button rounded-full px-4 py-2 text-sm font-semibold"
              >
                Opslaan
              </button>
              <button
                type="button"
                onClick={() => onToggleActive(photo.id)}
                className={`rounded-full px-4 py-2 text-sm font-semibold ${
                  photo.is_active
                    ? "theme-pill-button-active"
                    : "theme-pill-button"
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
          </form>
        </div>
      </aside>
    </div>
  );
}
