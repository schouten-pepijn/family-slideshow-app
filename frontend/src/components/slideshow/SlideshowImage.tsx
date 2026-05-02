import { useEffect, useState, type SyntheticEvent } from "react";
import type { Photo } from "../../types/photo";

type ImageOrientation = "unknown" | "portrait" | "landscape";

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
  const [imageOrientation, setImageOrientation] =
    useState<ImageOrientation>("unknown");
  const hasCaption = showCaption && Boolean(photo.title || photo.description);
  const showOverlayCaption = hasCaption;
  const isPortrait = imageOrientation === "portrait";
  // Never allow downward push in fullscreen, that causes top gap and clipped caption.
  const effectiveFullscreenOffsetY = fullscreen
    ? Math.min(fullscreenOffsetY, 0) - 8
    : 0;

  useEffect(() => {
    setImageOrientation("unknown");
  }, [photo.image_url]);

  function handleImageLoad(event: SyntheticEvent<HTMLImageElement>) {
    const image = event.currentTarget;
    setImageOrientation(
      image.naturalHeight > image.naturalWidth ? "portrait" : "landscape",
    );
  }

  if (fullscreen) {
    return (
      <div className="photo-stage relative flex h-[100svh] w-screen items-center justify-center overflow-hidden bg-transparent">
        {isPortrait && (
          <img
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 h-full w-full scale-110 object-cover opacity-45 blur-2xl saturate-125"
            src={photo.image_url}
            alt=""
          />
        )}

        {/* figure auto-sizes to the actual rendered image dimensions */}
        <figure
          className="relative z-10"
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
            onLoad={handleImageLoad}
          />

          {showCounter && (
            <div className="absolute top-3 right-3 rounded-full border border-white/10 bg-black/45 px-3 py-2 text-xs font-medium text-white/80 backdrop-blur-md sm:top-4 sm:right-4 sm:px-4 sm:text-sm">
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
    <div className="photo-stage relative flex w-full items-center justify-center overflow-hidden rounded-[1.5rem] border border-white/10 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.09),transparent_55%),rgba(5,10,20,0.92)] p-3 shadow-[0_30px_80px_rgba(0,0,0,0.45)] min-h-[52svh] sm:min-h-[68vh] sm:rounded-[2rem] sm:p-8">
      {isPortrait && (
        <img
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 h-full w-full scale-110 object-cover opacity-40 blur-2xl saturate-125"
          src={photo.image_url}
          alt=""
        />
      )}

      <div
        className={`relative z-10 inline-flex max-w-full items-end justify-center ${
          isPortrait ? "max-h-[64svh] sm:max-h-[72vh]" : ""
        }`}
      >
        <img
          className={`block max-w-full object-contain shadow-[0_25px_70px_rgba(0,0,0,0.35)] ${
            isPortrait
              ? "max-h-[64svh] rounded-[1.15rem] sm:max-h-[72vh] sm:rounded-[1.5rem]"
              : "max-h-[60svh] rounded-[1rem] sm:max-h-[72vh] sm:rounded-[1.5rem]"
          }`}
          src={photo.image_url}
          alt={photo.title ?? "Foto"}
          onLoad={handleImageLoad}
        />

        {showCounter && (
          <div className="absolute top-3 right-3 rounded-full border border-white/10 bg-black/45 px-3 py-2 text-xs font-medium text-white/80 backdrop-blur-md sm:top-5 sm:right-5 sm:px-4 sm:text-sm">
            {currentIndex + 1} / {totalPhotos}
          </div>
        )}

        {showOverlayCaption && (
          <div className="pointer-events-none absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent px-4 pt-16 pb-4 sm:px-6 sm:pt-20 sm:pb-6">
            <div className="max-w-2xl">
              {photo.title && (
                <strong className="block text-sm font-semibold text-white sm:text-xl">
                  {photo.title}
                </strong>
              )}
              {photo.description && (
                <p className="mt-1 max-h-10 overflow-hidden text-xs leading-5 text-white/75 sm:mt-2 sm:max-h-none sm:text-base sm:leading-6">
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
