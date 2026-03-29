import type { FormEvent } from "react";

type CollectionDrawerProps = {
  isOpen: boolean;
  isEditing: boolean;
  originalName: string;
  name: string;
  description: string;
  isPublic: boolean;
  onNameChange: (value: string) => void;
  onDescriptionChange: (value: string) => void;
  onIsPublicChange: (value: boolean) => void;
  onSubmit: (event: FormEvent<HTMLFormElement>) => Promise<void>;
  onClose: () => void;
};

export function CollectionDrawer({
  isOpen,
  isEditing,
  originalName,
  name,
  description,
  isPublic,
  onNameChange,
  onDescriptionChange,
  onIsPublicChange,
  onSubmit,
  onClose,
}: CollectionDrawerProps) {
  if (!isOpen) return null;

  return (
    <>
      <div
        className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
        aria-hidden="true"
      />

      <div className="fixed inset-y-0 right-0 z-50 flex w-full max-w-md flex-col bg-[#0f0f0f] shadow-2xl ring-1 ring-white/10">
        <div className="flex items-center justify-between border-b border-white/10 px-6 py-4">
          <div className="min-w-0">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-white/45">
              {isEditing ? "Bewerken" : "Nieuw"}
            </p>
            <h2 className="mt-0.5 truncate text-lg font-semibold">
              {isEditing && originalName ? originalName : "Nieuwe collectie"}
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="ml-4 shrink-0 rounded-full border border-white/10 px-4 py-2 text-sm font-semibold text-white/70 transition-colors hover:border-white/20 hover:text-white"
          >
            Sluit
          </button>
        </div>

        <form
          onSubmit={onSubmit}
          className="flex flex-1 flex-col overflow-y-auto"
        >
          <div className="flex flex-col gap-5 p-6">
            <label className="flex flex-col gap-2 text-sm font-medium">
              Naam
              <input
                type="text"
                value={name}
                onChange={(e) => onNameChange(e.target.value)}
                className="rounded-2xl border border-white/15 bg-white/5 px-4 py-3 text-white placeholder:text-white/40 outline-none transition focus:border-white/25 focus:bg-white/8"
                placeholder="Bijvoorbeeld: Vakantie 2025"
                autoFocus
              />
            </label>

            <label className="flex flex-col gap-2 text-sm font-medium">
              Beschrijving
              <textarea
                value={description}
                onChange={(e) => onDescriptionChange(e.target.value)}
                rows={5}
                className="resize-none rounded-2xl border border-white/15 bg-white/5 px-4 py-3 text-white placeholder:text-white/40 outline-none transition focus:border-white/25 focus:bg-white/8"
                placeholder="Korte toelichting bij deze collectie"
              />
            </label>

            <label className="flex cursor-pointer items-center gap-3 rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white/80 transition-colors hover:bg-white/8">
              <input
                type="checkbox"
                checked={isPublic}
                onChange={(e) => onIsPublicChange(e.target.checked)}
                className="accent-white"
              />
              Zichtbaar voor kijkers
            </label>
          </div>

          <div className="mt-auto flex flex-wrap gap-3 border-t border-white/10 px-6 py-5">
            <button
              type="submit"
              disabled={!name.trim()}
              className="theme-pill-button rounded-full px-5 py-2.5 text-sm font-semibold disabled:cursor-not-allowed disabled:opacity-50"
            >
              {isEditing ? "Wijzigingen opslaan" : "Collectie toevoegen"}
            </button>
            <button
              type="button"
              onClick={onClose}
              className="theme-pill-button rounded-full px-5 py-2.5 text-sm font-semibold"
            >
              Annuleren
            </button>
          </div>
        </form>
      </div>
    </>
  );
}
