import { Link } from "react-router-dom";

export function SlideshowEmptyState() {
  return (
    <div className="flex min-h-screen items-center px-4 py-8 text-white sm:px-6 lg:px-8">
      <div className="mx-auto flex w-full max-w-3xl flex-col items-center rounded-[2rem] border border-white/10 bg-black/25 px-8 py-14 text-center shadow-[0_30px_80px_rgba(0,0,0,0.35)] backdrop-blur-md">
        <p className="text-xs font-semibold uppercase tracking-[0.3em] text-white/45">
          Slideshow
        </p>
        <h1 className="mt-4 text-3xl font-semibold sm:text-4xl">
          Nog geen actieve foto&apos;s beschikbaar
        </h1>
        <p className="mt-4 max-w-xl text-sm leading-7 text-white/70 sm:text-base">
          Voeg eerst een paar foto&apos;s toe of zet bestaande items actief in
          het beheerscherm. Zodra er actieve foto&apos;s zijn, verschijnt de
          fotolijst hier automatisch.
        </p>
        <Link
          to="/admin"
          className="mt-8 rounded-full bg-white px-6 py-3 text-sm font-semibold text-black transition-opacity hover:opacity-90"
        >
          Open beheer
        </Link>
      </div>
    </div>
  );
}
