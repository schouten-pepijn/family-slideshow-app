import { FormEvent, useState } from "react";
import { PhotoList } from "../components/admin/PhotoList";
import { UploadForm } from "../components/upload/UploadForm";
import { usePhotos } from "../hooks/usePhotos";
import { useCollections } from "../hooks/useCollections";

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

  const {
    collections,
    isLoading: collectionsLoading,
    error: collectionsError,
    createNewCollection,
    editCollection,
    removeCollection,
  } = useCollections();

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
    <div className="min-h-screen px-4 pt-24 pb-8 text-white sm:px-6 lg:px-8">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-8">
        <header className="flex flex-col gap-3 text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.28em] text-white/45">
            Admin
          </p>
          <h1 className="text-3xl font-semibold tracking-tight sm:text-5xl">
            Beheer jouw digitale fotolijst
          </h1>
          <p className="mx-auto max-w-2xl text-sm leading-7 text-white/65 sm:text-base">
            Voeg nieuwe foto's toe, bekijk de huidige selectie, verwijder foto's
            en zet foto's actief of inactief voor de slideshow.
          </p>
        </header>

        <div className="mx-auto w-full max-w-3xl">
          <UploadForm onSubmit={addNewPhoto} />
        </div>

        <section className="rounded-[2rem] border border-white/10 bg-white/5 p-6 shadow-[0_30px_80px_rgba(0,0,0,0.35)] backdrop-blur md:p-8">
          <div className="mb-5 flex items-center justify-between gap-4">
            <div>
              <h2 className="text-2xl font-semibold">Huidige foto's</h2>
              <p className="mt-1 text-sm text-white/70">
                {photos.length} foto{photos.length === 1 ? "" : "'s"} in de
                huidige selectie.
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
            <PhotoList
              photos={photos}
              editingPhotoId={editingPhotoId}
              editTitle={editTitle}
              editDescription={editDescription}
              onEditTitleChange={setEditTitle}
              onEditDescriptionChange={setEditDescription}
              onStartEditing={handleStartEditing}
              onCancelEditing={handleCancelEditing}
              onSavePhotoDetails={handleSavePhotoDetails}
              onToggleActive={toggleActive}
              onRemovePhoto={handleRemovePhoto}
            />
          )}
        </section>
      </div>
    </div>
  );
}
