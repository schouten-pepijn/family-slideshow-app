import { FormEvent, useState } from "react";
import { UploadForm } from "../components/upload/UploadForm";
import { usePhotos } from "../hooks/usePhotos";

export function AdminPage() {
  const {
    photos,
    isLoading,
    error,
    addNewPhoto,
    editPhotoDetails,
    toggleActive,
    removePhoto,
  } = usePhotos();
  const [editingPhotoId, setEditingPhotoId] = useState<number | null>(null);
  const [editTitle, setEditTitle] = useState("");
  const [editDescription, setEditDescription] = useState("");

  function handleStartEditing(
    photoId: number,
    title: string | null,
    description: string | null,
  ) {
    setEditingPhotoId(photoId);
    setEditTitle(title ?? "");
    setEditDescription(description ?? "");
  }

  function handleCancelEditing() {
    setEditingPhotoId(null);
    setEditTitle("");
    setEditDescription("");
  }

  async function handleSavePhotoDetails(
    event: FormEvent<HTMLFormElement>,
    photoId: number,
  ) {
    event.preventDefault();
    await editPhotoDetails(photoId, editTitle, editDescription);
    handleCancelEditing();
  }

  async function handleRemovePhoto(photoId: number) {
    const confirmed = window.confirm(
      "Weet je zeker dat je deze foto wilt verwijderen?",
    );

    if (!confirmed) {
      return;
    }

    if (editingPhotoId === photoId) {
      handleCancelEditing();
    }

    await removePhoto(photoId);
  }

  return (
    <div className="min-h-screen px-4 py-8 text-white sm:px-6 lg:px-8">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-8">
        <header className="flex flex-col gap-2">
          <p className="text-sm uppercase tracking-[0.2em] text-white/50">
            Admin
          </p>
          <h1 className="text-3xl font-semibold">Beheer je fotolijst</h1>
          <p className="max-w-2xl text-sm text-white/70">
            Voeg nieuwe foto's toe, bekijk de huidige selectie, verwijder foto's
            en zet foto's actief of inactief voor de slideshow.
          </p>
        </header>

        <UploadForm onSubmit={addNewPhoto} />

        <section className="rounded-3xl border border-white/10 bg-white/5 p-6 shadow-[0_20px_60px_rgba(0,0,0,0.25)] backdrop-blur">
          <div className="mb-5 flex items-center justify-between gap-4">
            <div>
              <h2 className="text-2xl font-semibold">Huidige foto's</h2>
              <p className="mt-1 text-sm text-white/70">
                {photos.length} foto{photos.length === 1 ? "" : "'s"} in de
                lokale mock-state.
              </p>
            </div>
          </div>

          {isLoading && (
            <p className="rounded-2xl border border-white/10 bg-black/20 px-4 py-3 text-sm text-white/70">
              Foto's laden...
            </p>
          )}

          {!isLoading && error && (
            <p className="rounded-2xl border border-red-400/30 bg-red-500/10 px-4 py-3 text-sm text-red-100">
              {error}
            </p>
          )}

          {!isLoading && !error && photos.length === 0 && (
            <p className="rounded-2xl border border-white/10 bg-black/20 px-4 py-3 text-sm text-white/70">
              Er zijn nog geen foto's toegevoegd.
            </p>
          )}

          {!isLoading && photos.length > 0 && (
            <div className="grid gap-4">
              {photos.map((photo) => (
                <article
                  key={photo.id}
                  className="grid gap-4 rounded-3xl border border-white/10 bg-black/20 p-4 md:grid-cols-[180px_1fr_auto]"
                >
                  <div className="overflow-hidden rounded-2xl bg-black/30">
                    <img
                      src={photo.image_url}
                      alt={photo.title ?? "Foto"}
                      className="h-40 w-full object-cover"
                    />
                  </div>

                  <div className="flex flex-col gap-2">
                    {editingPhotoId === photo.id ? (
                      <form
                        onSubmit={(event) =>
                          handleSavePhotoDetails(event, photo.id)
                        }
                        className="flex flex-col gap-3"
                      >
                        <label className="flex flex-col gap-2 text-sm font-medium text-white/80">
                          Titel
                          <input
                            type="text"
                            value={editTitle}
                            onChange={(event) => setEditTitle(event.target.value)}
                            className="rounded-2xl border border-white/15 bg-black/30 px-4 py-3 text-white placeholder:text-white/40"
                          />
                        </label>

                        <label className="flex flex-col gap-2 text-sm font-medium text-white/80">
                          Beschrijving
                          <textarea
                            value={editDescription}
                            onChange={(event) =>
                              setEditDescription(event.target.value)
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
                            onClick={handleCancelEditing}
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
                          handleStartEditing(
                            photo.id,
                            photo.title,
                            photo.description,
                          )
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
                      onClick={() => toggleActive(photo.id)}
                      className="rounded-full border border-white/15 bg-white/10 px-4 py-2 text-sm font-semibold transition-colors hover:bg-white/15"
                    >
                      {photo.is_active ? "Zet inactief" : "Zet actief"}
                    </button>
                    <button
                      type="button"
                      onClick={() => handleRemovePhoto(photo.id)}
                      className="rounded-full border border-red-400/30 bg-red-500/10 px-4 py-2 text-sm font-semibold text-red-100 transition-colors hover:bg-red-500/20"
                    >
                      Verwijder
                    </button>
                  </div>
                </article>
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
