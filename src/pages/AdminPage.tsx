import { FormEvent, useState } from "react";
import { PhotoList } from "../components/admin/PhotoList";
import { UploadForm } from "../components/upload/UploadForm";
import { usePhotos } from "../hooks/usePhotos";
import { useCollections } from "../hooks/useCollections";
import { CollectionForm } from "../components/admin/CollectionForm";
import { CollectionList } from "../components/admin/CollectionList";

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
  const [editingCollectionId, setEditingCollectionId] = useState<number | null>(
    null,
  );
  const [collectionName, setCollectionName] = useState("");
  const [collectionDescription, setCollectionDescription] = useState("");
  const [collectionIsPublic, setCollectionIsPublic] = useState(false);
  const [editTitle, setEditTitle] = useState("");
  const [editDescription, setEditDescription] = useState("");
  const [editCollectionIds, setEditCollectionIds] = useState<number[]>([]);

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
    collectionIds: number[],
  ) {
    setEditingPhotoId(photoId);
    setEditTitle(title ?? "");
    setEditDescription(description ?? "");
    setEditCollectionIds(collectionIds);
  }

  function handleCancelEditing() {
    setEditingPhotoId(null);
    setEditTitle("");
    setEditDescription("");
    setEditCollectionIds([]);
  }

  async function handleSavePhotoDetails(
    event: FormEvent<HTMLFormElement>,
    photoId: number,
  ) {
    event.preventDefault();
    await editPhotoDetails(
      photoId,
      editTitle,
      editDescription,
      editCollectionIds,
    );
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

  function handleStartEditingCollection(
    collectionId: number,
    name: string,
    description: string | null,
    isPublic: boolean,
  ) {
    setEditingCollectionId(collectionId);
    setCollectionName(name);
    setCollectionDescription(description ?? "");
    setCollectionIsPublic(isPublic);
  }

  function handleCancelCollectionEditing() {
    setEditingCollectionId(null);
    setCollectionName("");
    setCollectionDescription("");
    setCollectionIsPublic(false);
  }

  async function handleSaveCollection(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!collectionName.trim()) return;

    if (editingCollectionId !== null) {
      await editCollection(editingCollectionId, {
        name: collectionName.trim(),
        description: collectionDescription.trim() || null,
        is_public: collectionIsPublic,
      });
    } else {
      await createNewCollection(
        collectionName.trim(),
        collectionDescription.trim() || undefined,
        collectionIsPublic,
      );
    }

    handleCancelCollectionEditing();
  }

  async function handleRemoveCollection(collectionId: number) {
    const confirmed = window.confirm(
      "Weet je zeker dat je deze collectie wilt verwijderen?",
    );

    if (!confirmed) return;

    if (editingCollectionId === collectionId) handleCancelCollectionEditing();

    await removeCollection(collectionId);
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
          <UploadForm collections={collections} onSubmit={addNewPhoto} />
        </div>
        <section className="rounded-[2rem] border border-white/10 bg-white/5 p-6 shadow-[0_30px_80px_rgba(0,0,0,0.35)] backdrop-blur md:p-8">
          <div className="mb-5 flex items-center justify-between gap-4">
            <div>
              <h2 className="text-2xl font-semibold">Collecties</h2>
              <p className="mt-1 text-sm text-white/70">
                Beheer welke verzamelingen zichtbaar zijn in de slideshow.
              </p>
            </div>
          </div>

          <div className="grid gap-6">
            <CollectionForm
              name={collectionName}
              description={collectionDescription}
              isPublic={collectionIsPublic}
              isEditing={editingCollectionId !== null}
              onNameChange={setCollectionName}
              onDescriptionChange={setCollectionDescription}
              onIsPublicChange={setCollectionIsPublic}
              onSubmit={handleSaveCollection}
              onCancel={handleCancelCollectionEditing}
            />

            {collectionsLoading && (
              <p className="rounded-2xl border border-white/10 bg-black/20 px-4 py-3 text-sm text-white/70">
                Collecties laden...
              </p>
            )}

            {!collectionsLoading && collectionsError && (
              <p className="rounded-2xl border border-red-400/30 bg-red-500/10 px-4 py-3 text-sm text-red-100">
                {collectionsError}
              </p>
            )}

            {!collectionsLoading &&
              !collectionsError &&
              collections.length === 0 && (
                <p className="rounded-2xl border border-white/10 bg-black/20 px-4 py-3 text-sm text-white/70">
                  Er zijn nog geen collecties toegevoegd.
                </p>
              )}

            {!collectionsLoading && collections.length > 0 && (
              <CollectionList
                collections={collections}
                editingCollectionId={editingCollectionId}
                onStartEditing={handleStartEditingCollection}
                onRemoveCollection={handleRemoveCollection}
              />
            )}
          </div>
        </section>

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
              collections={collections}
              editingPhotoId={editingPhotoId}
              editTitle={editTitle}
              editDescription={editDescription}
              editCollectionIds={editCollectionIds}
              onEditTitleChange={setEditTitle}
              onEditDescriptionChange={setEditDescription}
              onEditCollectionIdsChange={setEditCollectionIds}
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
