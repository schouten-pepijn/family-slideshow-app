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
      <div
        key={photo.id}
        className="photo-stage relative flex h-[100svh] w-screen items-center justify-center overflow-hidden bg-black"
      >
        <img
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 h-full w-full scale-125 object-cover opacity-70 blur-2xl brightness-75 saturate-150"
          src={photo.image_url}
          alt=""
        />
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,rgba(0,0,0,0.2)_45%,rgba(0,0,0,0.72)_100%)]" />

        {/* figure auto-sizes to the actual rendered image dimensions */}
        <figure
          className="relative z-10 flex h-full w-full items-center justify-center p-2 sm:p-4"
          style={{
            transform: `translateY(${effectiveFullscreenOffsetY}px) scale(${fullscreenZoom / 100})`,
            transformOrigin: "center center",
            transition: "transform 300ms ease-out",
          }}
        >
          <img
            className="block max-h-[100svh] max-w-[100svw] object-contain shadow-[0_28px_90px_rgba(0,0,0,0.55)]"
            src={photo.image_url}
            alt={photo.title ?? "Foto"}
          />
        </figure>

        {showCounter && (
          <div className="absolute top-3 right-3 z-20 rounded-full border border-white/10 bg-black/45 px-3 py-2 text-xs font-medium text-white/80 backdrop-blur-md sm:top-4 sm:right-4 sm:px-4 sm:text-sm">
            {currentIndex + 1} / {totalPhotos}
          </div>
        )}

        {showOverlayCaption && (
          <div className="pointer-events-none absolute inset-x-0 bottom-0 z-20 bg-gradient-to-t from-black/75 via-black/25 to-transparent px-3 pt-16 pb-3 sm:px-5 sm:pt-24 sm:pb-5">
            <div className="mx-auto max-w-[calc(100svw-1.5rem)] sm:mx-0 sm:max-w-3xl">
              <div className="inline-block rounded-xl border border-white/20 bg-black/55 px-3 py-2 shadow-[0_14px_45px_rgba(0,0,0,0.4)] backdrop-blur-md sm:rounded-2xl sm:px-4 sm:py-3">
                {photo.title && (
                  <strong className="slideshow-caption-title block font-semibold text-white">
                    {photo.title}
                  </strong>
                )}
                {photo.description && (
                  <p className="slideshow-caption-description mt-1 max-h-10 overflow-hidden text-white/80 sm:mt-1.5 sm:max-h-none">
                    {photo.description}
                  </p>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <div
      key={photo.id}
      className="photo-stage relative flex w-full items-center justify-center overflow-hidden rounded-[1.5rem] border border-white/10 bg-black p-3 shadow-[0_30px_80px_rgba(0,0,0,0.45)] min-h-[58svh] sm:min-h-[68vh] sm:rounded-[2rem] sm:p-8"
    >
      <img
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 h-full w-full scale-125 object-cover opacity-70 blur-2xl brightness-75 saturate-150"
        src={photo.image_url}
        alt=""
      />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.08)_0%,rgba(0,0,0,0.12)_42%,rgba(0,0,0,0.68)_100%)]" />
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,rgba(255,255,255,0.08),transparent_24%,rgba(0,0,0,0.34)_100%)]" />

      <figure className="relative z-10 flex h-full w-full items-center justify-center">
        <img
          className="block h-auto max-h-[64svh] max-w-full rounded-[1.15rem] object-contain shadow-[0_28px_90px_rgba(0,0,0,0.58)] ring-1 ring-white/10 sm:max-h-[72vh] sm:rounded-[1.5rem]"
          src={photo.image_url}
          alt={photo.title ?? "Foto"}
        />
      </figure>

      {showCounter && (
        <div className="absolute top-3 right-3 z-20 rounded-full border border-white/10 bg-black/45 px-3 py-2 text-xs font-medium text-white/80 backdrop-blur-md sm:top-5 sm:right-5 sm:px-4 sm:text-sm">
          {currentIndex + 1} / {totalPhotos}
        </div>
      )}

      {showOverlayCaption && (
        <div className="pointer-events-none absolute inset-x-0 bottom-0 z-20 bg-gradient-to-t from-black/75 via-black/25 to-transparent px-3 pt-16 pb-3 sm:px-6 sm:pt-24 sm:pb-6">
          <div className="mx-auto max-w-[calc(100vw-1.5rem)] sm:mx-0 sm:max-w-2xl">
            <div className="inline-block rounded-xl border border-white/15 bg-black/50 px-3 py-2 shadow-[0_14px_45px_rgba(0,0,0,0.36)] backdrop-blur-md sm:rounded-2xl sm:px-4 sm:py-3">
              {photo.title && (
                <strong className="slideshow-caption-title block font-semibold text-white">
                  {photo.title}
                </strong>
              )}
              {photo.description && (
                <p className="slideshow-caption-description mt-1 max-h-10 overflow-hidden text-white/80 sm:mt-2 sm:max-h-none">
                  {photo.description}
                </p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
