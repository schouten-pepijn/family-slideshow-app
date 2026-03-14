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
  const hasCaption = Boolean(photo.title || photo.description);

  return (
    <div className="relative flex min-h-[60vh] w-full items-center justify-center overflow-hidden rounded-[2rem] border border-white/10 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.09),transparent_55%),rgba(5,10,20,0.92)] p-6 shadow-[0_30px_80px_rgba(0,0,0,0.45)] sm:min-h-[68vh] sm:p-8">
      <img
        className="block max-h-[72vh] w-full rounded-[1.5rem] object-contain shadow-[0_25px_70px_rgba(0,0,0,0.35)]"
        src={photo.image_url}
        alt={photo.title ?? "Foto"}
      />
      <div className="absolute top-5 right-5 rounded-full border border-white/10 bg-black/45 px-4 py-2 text-sm font-medium text-white/80 backdrop-blur-md">
        {currentIndex + 1} / {totalPhotos}
      </div>

      {hasCaption && (
        <div className="pointer-events-none absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent px-6 pt-20 pb-6 sm:px-8 sm:pb-8">
          <div className="max-w-2xl">
            {photo.title && (
              <strong className="block text-lg font-semibold text-white sm:text-xl">
                {photo.title}
              </strong>
            )}
            {photo.description && (
              <p className="mt-2 text-sm leading-6 text-white/75 sm:text-base">
                {photo.description}
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
