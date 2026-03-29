import { FormEvent, useEffect, useState } from "react";
import { PhotoList } from "../components/admin/PhotoList";
import { PhotoDetailsDrawer } from "../components/admin/PhotoDetailsDrawer";
import { UploadForm } from "../components/upload/UploadForm";
import { usePhotos } from "../hooks/usePhotos";
import { useCollections } from "../hooks/useCollections";
import { CollectionForm } from "../components/admin/CollectionForm";
import { CollectionList } from "../components/admin/CollectionList";
import type { Photo } from "../types/photo";

type PhotoStatusFilter = "all" | "active" | "inactive";
type PhotoSortOption =
  | "updated-desc"
  | "updated-asc"
  | "title-asc"
  | "title-desc"
  | "size-desc"
  | "size-asc";

const PAGE_SIZE_OPTIONS = [12, 24, 48];

function comparePhotos(a: Photo, b: Photo, sortOption: PhotoSortOption) {
  switch (sortOption) {
    case "updated-asc":
      return (
        new Date(a.updated_at).getTime() - new Date(b.updated_at).getTime()
      );
    case "title-asc":
      return (a.title ?? a.filename).localeCompare(
        b.title ?? b.filename,
        "nl",
        {
          sensitivity: "base",
        },
      );
    case "title-desc":
      return (b.title ?? b.filename).localeCompare(
        a.title ?? a.filename,
        "nl",
        {
          sensitivity: "base",
        },
      );
    case "size-desc":
      return b.file_size - a.file_size;
    case "size-asc":
      return a.file_size - b.file_size;
    case "updated-desc":
    default:
      return (
        new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime()
      );
  }
}

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
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<PhotoStatusFilter>("all");
  const [collectionFilter, setCollectionFilter] = useState<string>("all");
  const [sortOption, setSortOption] = useState<PhotoSortOption>("updated-desc");
  const [pageSize, setPageSize] = useState(12);
  const [currentPage, setCurrentPage] = useState(1);

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

  const normalizedSearchQuery = searchQuery.trim().toLowerCase();
  const selectedCollectionId =
    collectionFilter === "all" ? null : Number(collectionFilter);

  const filteredPhotos = [...photos]
    .filter((photo) => {
      if (statusFilter === "active" && !photo.is_active) {
        return false;
      }

      if (statusFilter === "inactive" && photo.is_active) {
        return false;
      }

      if (
        selectedCollectionId !== null &&
        !photo.collection_ids.includes(selectedCollectionId)
      ) {
        return false;
      }

      if (!normalizedSearchQuery) {
        return true;
      }

      const matchingCollectionNames = collections
        .filter((collection) => photo.collection_ids.includes(collection.id))
        .map((collection) => collection.name)
        .join(" ");

      const searchableText = [
        photo.title,
        photo.description,
        photo.filename,
        matchingCollectionNames,
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();

      return searchableText.includes(normalizedSearchQuery);
    })
    .sort((a, b) => comparePhotos(a, b, sortOption));

  const totalPages = Math.max(1, Math.ceil(filteredPhotos.length / pageSize));

  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(totalPages);
    }
  }, [currentPage, totalPages]);

  const paginatedPhotos = filteredPhotos.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize,
  );

  const selectedPhoto =
    editingPhotoId === null
      ? null
      : (photos.find((photo) => photo.id === editingPhotoId) ?? null);

  function resetToFirstPage() {
    setCurrentPage(1);
  }

  function handleClearPhotoFilters() {
    setSearchQuery("");
    setStatusFilter("all");
    setCollectionFilter("all");
    setSortOption("updated-desc");
    setPageSize(12);
    setCurrentPage(1);
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
          <div className="mb-5 flex flex-col gap-5">
            <div className="flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
              <div>
                <h2 className="text-2xl font-semibold">Huidige foto's</h2>
                <p className="mt-1 text-sm text-white/70">
                  {filteredPhotos.length} van {photos.length} foto
                  {photos.length === 1 ? "" : "'s"} zichtbaar.
                </p>
              </div>

              <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-[minmax(0,1.5fr)_repeat(3,minmax(0,0.8fr))_auto]">
                <label className="flex min-w-0 flex-col gap-2 text-xs font-semibold uppercase tracking-[0.14em] text-white/50">
                  Zoeken
                  <input
                    type="search"
                    value={searchQuery}
                    onChange={(event) => {
                      setSearchQuery(event.target.value);
                      resetToFirstPage();
                    }}
                    placeholder="Titel, bestand of collectie"
                    className="rounded-2xl border border-white/10 bg-black/20 px-4 py-3 text-sm font-medium normal-case tracking-normal text-white outline-none transition focus:border-white/25 focus:bg-black/30"
                  />
                </label>

                <label className="flex flex-col gap-2 text-xs font-semibold uppercase tracking-[0.14em] text-white/50">
                  Status
                  <select
                    value={statusFilter}
                    onChange={(event) => {
                      setStatusFilter(event.target.value as PhotoStatusFilter);
                      resetToFirstPage();
                    }}
                    className="rounded-2xl border border-white/10 bg-black/20 px-4 py-3 text-sm font-medium normal-case tracking-normal text-white outline-none transition focus:border-white/25 focus:bg-black/30"
                  >
                    <option value="all">Alle foto's</option>
                    <option value="active">Alleen actief</option>
                    <option value="inactive">Alleen inactief</option>
                  </select>
                </label>

                <label className="flex flex-col gap-2 text-xs font-semibold uppercase tracking-[0.14em] text-white/50">
                  Collectie
                  <select
                    value={collectionFilter}
                    onChange={(event) => {
                      setCollectionFilter(event.target.value);
                      resetToFirstPage();
                    }}
                    className="rounded-2xl border border-white/10 bg-black/20 px-4 py-3 text-sm font-medium normal-case tracking-normal text-white outline-none transition focus:border-white/25 focus:bg-black/30"
                  >
                    <option value="all">Alle collecties</option>
                    {collections.map((collection) => (
                      <option
                        key={collection.id}
                        value={collection.id.toString()}
                      >
                        {collection.name}
                      </option>
                    ))}
                  </select>
                </label>

                <label className="flex flex-col gap-2 text-xs font-semibold uppercase tracking-[0.14em] text-white/50">
                  Sortering
                  <select
                    value={sortOption}
                    onChange={(event) => {
                      setSortOption(event.target.value as PhotoSortOption);
                      resetToFirstPage();
                    }}
                    className="rounded-2xl border border-white/10 bg-black/20 px-4 py-3 text-sm font-medium normal-case tracking-normal text-white outline-none transition focus:border-white/25 focus:bg-black/30"
                  >
                    <option value="updated-desc">Recent bijgewerkt</option>
                    <option value="updated-asc">Langst niet bijgewerkt</option>
                    <option value="title-asc">Titel A-Z</option>
                    <option value="title-desc">Titel Z-A</option>
                    <option value="size-desc">Grootste bestand</option>
                    <option value="size-asc">Kleinste bestand</option>
                  </select>
                </label>

                <button
                  type="button"
                  onClick={handleClearPhotoFilters}
                  className="theme-pill-button h-fit rounded-full px-4 py-3 text-sm font-semibold"
                >
                  Reset
                </button>
              </div>
            </div>

            <div className="flex flex-col gap-3 rounded-[1.5rem] border border-white/10 bg-black/20 px-4 py-4 sm:flex-row sm:items-center sm:justify-between">
              <h2 className="text-2xl font-semibold">Huidige foto's</h2>
              <div className="flex flex-wrap items-center gap-3 text-sm text-white/70">
                <span>
                  Pagina {currentPage} van {totalPages}
                </span>
                <label className="flex items-center gap-2">
                  <span>Per pagina</span>
                  <select
                    value={pageSize}
                    onChange={(event) => {
                      setPageSize(Number(event.target.value));
                      setCurrentPage(1);
                    }}
                    className="rounded-full border border-white/10 bg-white/8 px-3 py-2 text-sm text-white outline-none transition focus:border-white/25"
                  >
                    {PAGE_SIZE_OPTIONS.map((option) => (
                      <option key={option} value={option}>
                        {option}
                      </option>
                    ))}
                  </select>
                </label>
              </div>
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

          {!isLoading &&
            !error &&
            photos.length > 0 &&
            filteredPhotos.length === 0 && (
              <p className="rounded-2xl border border-white/10 bg-black/20 px-4 py-3 text-sm text-white/70">
                Geen foto's gevonden voor de huidige filters. Pas je zoekterm of
                filters aan.
              </p>
            )}

          {!isLoading && photos.length > 0 && filteredPhotos.length > 0 && (
            <>
              <PhotoList
                photos={paginatedPhotos}
                selectedPhotoId={editingPhotoId}
                collections={collections}
                onSelectPhoto={(photo) =>
                  handleStartEditing(
                    photo.id,
                    photo.title,
                    photo.description,
                    photo.collection_ids,
                  )
                }
                onToggleActive={toggleActive}
                onRemovePhoto={handleRemovePhoto}
              />

              <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <p className="text-sm text-white/60">
                  Toon {paginatedPhotos.length} foto
                  {paginatedPhotos.length === 1 ? "" : "'s"} op deze pagina.
                </p>
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() =>
                      setCurrentPage((page) => Math.max(1, page - 1))
                    }
                    disabled={currentPage === 1}
                    className="theme-pill-button rounded-full px-4 py-2 text-sm font-semibold disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    Vorige
                  </button>
                  <span className="rounded-full border border-white/10 bg-white/8 px-4 py-2 text-sm font-semibold text-white/75">
                    {currentPage} / {totalPages}
                  </span>
                  <button
                    type="button"
                    onClick={() =>
                      setCurrentPage((page) => Math.min(totalPages, page + 1))
                    }
                    disabled={currentPage === totalPages}
                    className="theme-pill-button rounded-full px-4 py-2 text-sm font-semibold disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    Volgende
                  </button>
                </div>
              </div>
            </>
          )}
        </section>
      </div>

      <PhotoDetailsDrawer
        photo={selectedPhoto}
        collections={collections}
        editTitle={editTitle}
        editDescription={editDescription}
        editCollectionIds={editCollectionIds}
        onEditTitleChange={setEditTitle}
        onEditDescriptionChange={setEditDescription}
        onEditCollectionIdsChange={setEditCollectionIds}
        onClose={handleCancelEditing}
        onSavePhotoDetails={handleSavePhotoDetails}
        onToggleActive={toggleActive}
        onRemovePhoto={handleRemovePhoto}
      />
    </div>
  );
}
