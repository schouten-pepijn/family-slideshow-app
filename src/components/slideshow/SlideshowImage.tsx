import type { Photo } from "../../types/photo";

type SlideshowImageProps = {
  photo: Photo;
  currentIndex: number;
  totalPhotos: number;
};

export function SlideshowImage({
  photo,
  currentIndex,
  totalPhotos,
}: SlideshowImageProps) {
  return (
    <div className="relative w-full overflow-hidden rounded-2xl shadow-[0_20px_40px_rgba(0,0,0,0.5)]">
      <img
        className="block h-auto w-full object-cover"
        src={photo.image_url}
        alt={photo.title ?? "Foto"}
      />
      <div className="absolute right-0 bottom-0 left-0 bg-black/45 px-5 py-4 text-white">
        <div className="mb-1 flex items-baseline justify-between">
          <strong className="text-base">{photo.title ?? "Zonder titel"}</strong>
          <span className="text-sm text-white/60">
            {currentIndex + 1} / {totalPhotos}
          </span>
        </div>
        <p className="m-0 text-sm text-white/75">
          {photo.description ?? "Geen beschrijving beschikbaar"}
        </p>
      </div>
    </div>
  );
}
