import type { Photo } from "../../types/photo";

type SlideshowImageProps = {
  photo: Photo;
  currentIndex: number;
  totalPhotos: number;
  showCaption?: boolean;
  showCounter?: boolean;
  fullscreen?: boolean;
};

export function SlideshowImage({
  photo,
  currentIndex,
  totalPhotos,
  showCaption = true,
  showCounter = true,
  fullscreen = false,
}: SlideshowImageProps) {
  const hasCaption = showCaption && Boolean(photo.title || photo.description);
  const showOverlayCaption = hasCaption && !fullscreen;
  const showFullscreenCaption = hasCaption && fullscreen;

  return (
    <div
      className={`relative flex w-full items-center justify-center border border-white/10 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.09),transparent_55%),rgba(5,10,20,0.92)] shadow-[0_30px_80px_rgba(0,0,0,0.45)] ${
        fullscreen
          ? "min-h-screen rounded-none px-4 py-6 sm:px-8 sm:py-8"
          : "min-h-[60vh] overflow-hidden rounded-[2rem] p-6 sm:min-h-[68vh] sm:p-8"
      }`}
    >
      <div
        className={`flex w-full items-center justify-center ${
          fullscreen ? "max-w-[110rem] flex-col gap-4" : ""
        }`}
      >
        <div className="relative inline-flex max-w-full items-end justify-center">
          <img
            className={`block max-w-full object-contain shadow-[0_25px_70px_rgba(0,0,0,0.35)] ${
              fullscreen
                ? "max-h-[72vh] rounded-[1rem] sm:max-h-[76vh] sm:rounded-[1.5rem]"
                : "max-h-[72vh] rounded-[1.5rem]"
            }`}
            src={photo.image_url}
            alt={photo.title ?? "Foto"}
          />

          {showCounter && (
            <div className="absolute top-5 right-5 rounded-full border border-white/10 bg-black/45 px-4 py-2 text-sm font-medium text-white/80 backdrop-blur-md">
              {currentIndex + 1} / {totalPhotos}
            </div>
          )}

          {showOverlayCaption && (
            <div className="pointer-events-none absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent px-5 pt-20 pb-5 sm:px-6 sm:pb-6">
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

        {showFullscreenCaption && (
          <div className="w-full max-w-4xl rounded-[1.5rem] border border-white/10 bg-black/35 px-5 py-4 text-left shadow-[0_20px_60px_rgba(0,0,0,0.28)] backdrop-blur-md sm:px-6">
            {photo.title && (
              <strong className="block text-xl font-semibold text-white sm:text-2xl">
                {photo.title}
              </strong>
            )}
            {photo.description && (
              <p className="mt-2 text-sm leading-6 text-white/78 sm:text-base">
                {photo.description}
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
