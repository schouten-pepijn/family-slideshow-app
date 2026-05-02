import { useMemo, useState } from "react";
import { Slideshow } from "../components/slideshow/Slideshow";
import { SlideshowEmptyState } from "../components/slideshow/SlideshowEmptyState";
import { usePhotos } from "../hooks/usePhotos";
import { useCollections } from "../hooks/useCollections";
import { CollectionSelector } from "../components/slideshow/CollectionSelector";

export function SlideshowPage() {
  const { photos, isLoading, error } = usePhotos();
  const { collections } = useCollections();
  const [selectedCollectionId, setSelectedCollectionId] = useState<
    number | "all"
  >("all");

  const activePhotos = useMemo(
    () => photos.filter((photo) => photo.is_active),
    [photos],
  );

  const filteredPhotos = useMemo(() => {
    if (selectedCollectionId === "all") return activePhotos;

    return activePhotos.filter((photo) =>
      photo.collection_ids.includes(selectedCollectionId),
    );
  }, [activePhotos, selectedCollectionId]);

  const selectedCollection = useMemo(() => {
    if (selectedCollectionId === "all") {
      return null;
    }

    return collections.find(
      (collection) => collection.id === selectedCollectionId,
    );
  }, [collections, selectedCollectionId]);

  if (isLoading) {
    return (
      <div className="theme-page flex min-h-screen items-center px-4 pt-36 pb-8 text-white sm:px-6 sm:py-8 lg:px-8">
        <div className="mx-auto w-full max-w-3xl rounded-[1.5rem] border border-white/10 bg-black/25 px-5 py-10 text-center shadow-[0_30px_80px_rgba(0,0,0,0.35)] backdrop-blur-md sm:rounded-[2rem] sm:px-8 sm:py-14">
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-white/45">
            Slideshow
          </p>
          <h1 className="display-page-title mt-4 text-3xl font-semibold sm:text-4xl">
            Foto's worden geladen
          </h1>
          <p className="mt-4 text-sm leading-7 text-white/70 sm:text-base">
            We bouwen de huidige selectie op voor de fotolijst.
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="theme-page flex min-h-screen items-center px-4 pt-36 pb-8 text-white sm:px-6 sm:py-8 lg:px-8">
        <div className="mx-auto w-full max-w-3xl rounded-[1.5rem] border border-red-400/20 bg-red-500/10 px-5 py-10 text-center shadow-[0_30px_80px_rgba(0,0,0,0.35)] backdrop-blur-md sm:rounded-[2rem] sm:px-8 sm:py-14">
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-red-100/70">
            Fout
          </p>
          <h1 className="display-page-title mt-4 text-3xl font-semibold sm:text-4xl">
            De slideshow kon niet worden geladen
          </h1>
          <p className="mt-4 text-sm leading-7 text-red-50/90 sm:text-base">
            {error}
          </p>
        </div>
      </div>
    );
  }

  if (activePhotos.length === 0) return <SlideshowEmptyState />;

  const selector =
    collections.length > 0 ? (
      <CollectionSelector
        collections={collections}
        selectedCollectionId={selectedCollectionId}
        onSelectCollection={setSelectedCollectionId}
      />
    ) : null;

  if (filteredPhotos.length === 0) {
    return (
      <div className="theme-page min-h-screen px-4 pt-36 pb-8 text-white sm:px-6 sm:pt-24 lg:px-8">
        <div className="mx-auto flex w-full max-w-7xl flex-col gap-6">
          {selector}

          <div className="mx-auto w-full max-w-3xl rounded-[1.5rem] border border-white/10 bg-black/25 px-5 py-10 text-center shadow-[0_30px_80px_rgba(0,0,0,0.35)] backdrop-blur-md sm:rounded-[2rem] sm:px-8 sm:py-14">
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-white/45">
              Collectie
            </p>
            <h2 className="display-page-title mt-4 text-3xl font-semibold sm:text-4xl">
              Geen actieve foto&apos;s in deze collectie
            </h2>
            <p className="mt-4 text-sm leading-7 text-white/70 sm:text-base">
              {selectedCollection
                ? `De collectie "${selectedCollection.name}" heeft nu geen actieve foto's.`
                : "Deze selectie heeft nu geen actieve foto's."}
            </p>
          </div>
        </div>
      </div>
    );
  }

  return <Slideshow photos={filteredPhotos} headerContent={selector} />;
}
