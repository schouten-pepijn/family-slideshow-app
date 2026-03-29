import type { Photo } from "../../types/photo";

type SlideshowImageProps = {
  photo: Photo;
  currentIndex: number;
  totalPhotos: number;
  showCaption?: boolean;
  showCounter?: boolean;
  fullscreen?: boolean;
  fullscreenZoom?: number;
  fullscreenOffsetY?: number;
};

export function SlideshowImage({
  photo,
  currentIndex,
  totalPhotos,
  showCaption = true,
  showCounter = true,
  fullscreen = false,
  fullscreenZoom = 100,
  fullscreenOffsetY = 0,
}: SlideshowImageProps) {
  const hasCaption = showCaption && Boolean(photo.title || photo.description);
  const showOverlayCaption = hasCaption;
  // Never allow downward push in fullscreen, that causes top gap and clipped caption.
  const effectiveFullscreenOffsetY = fullscreen
    ? Math.min(fullscreenOffsetY, 0) - 8
    : 0;

  if (fullscreen) {
    return (
      <div className="flex h-screen w-screen items-center justify-center bg-transparent">
        {/* figure auto-sizes to the actual rendered image dimensions */}
        <figure
          className="relative"
          style={{
            transform: `translateY(${effectiveFullscreenOffsetY}px) scale(${fullscreenZoom / 100})`,
            transformOrigin: "center center",
            transition: "transform 300ms ease-out",
          }}
        >
          <img
            className="block max-h-[100svh] max-w-[100svw] object-contain"
            src={photo.image_url}
            alt={photo.title ?? "Foto"}
          />

          {showCounter && (
            <div className="absolute top-4 right-4 rounded-full border border-white/10 bg-black/45 px-4 py-2 text-sm font-medium text-white/80 backdrop-blur-md">
              {currentIndex + 1} / {totalPhotos}
            </div>
          )}

          {showOverlayCaption && (
            <div className="pointer-events-none absolute inset-x-0 bottom-0 rounded-b-[0.5rem] bg-gradient-to-t from-black/80 via-black/30 to-transparent px-3.5 pt-18 pb-3.5 sm:px-5 sm:pb-4.5">
              <div className="max-w-3xl">
                <div className="inline-block rounded-2xl border border-white/20 bg-black/48 px-3.5 py-2.5 shadow-[0_10px_35px_rgba(0,0,0,0.35)] backdrop-blur-md sm:px-4.5 sm:py-2.5">
                  {photo.title && (
                    <strong className="block text-lg font-semibold text-white sm:text-xl">
                      {photo.title}
                    </strong>
                  )}
                  {photo.description && (
                    <p className="mt-1.5 text-xs leading-5 text-white/82 sm:text-sm">
                      {photo.description}
                    </p>
                  )}
                </div>
              </div>
            </div>
          )}
        </figure>
      </div>
    );
  }

  return (
    <div className="relative flex w-full items-center justify-center overflow-hidden rounded-[2rem] border border-white/10 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.09),transparent_55%),rgba(5,10,20,0.92)] p-6 shadow-[0_30px_80px_rgba(0,0,0,0.45)] min-h-[60vh] sm:min-h-[68vh] sm:p-8">
      <div className="relative inline-flex max-w-full items-end justify-center">
        <img
          className="block max-h-[72vh] max-w-full rounded-[1.5rem] object-contain shadow-[0_25px_70px_rgba(0,0,0,0.35)]"
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
    </div>
  );
}
