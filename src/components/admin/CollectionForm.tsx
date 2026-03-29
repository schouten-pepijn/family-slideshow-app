import type { FormEvent } from "react";

type CollectionFormProps = {
  name: string;
  description: string;
  isPublic: boolean;
  isEditing: boolean;
  onNameChange: (value: string) => void;
  onDescriptionChange: (value: string) => void;
  onIsPublicChange: (value: boolean) => void;
  onSubmit: (event: FormEvent<HTMLFormElement>) => Promise<void>;
  onCancel: () => void;
};

export function CollectionForm({
  name,
  description,
  isPublic,
  isEditing,
  onNameChange,
  onDescriptionChange,
  onIsPublicChange,
  onSubmit,
  onCancel,
}: CollectionFormProps) {
  return (
    <form
      onSubmit={onSubmit}
      className="rounded-3xl border border-white/10 bg-black/20 p-5"
    >
      <div className="flex flex-col gap-4">
        <div>
          <h2 className="text-xl font-semibold">
            {isEditing ? "Collectie bewerken" : "Collectie toevoegen"}
          </h2>
          <p className="mt-1 text-sm text-white/70">
            Geef een naam, optionele beschrijving en kies of kijkers deze mogen
            zien.
          </p>
        </div>

        <label className="flex flex-col gap-2 text-sm font-medium">
          Naam
          <input
            type="text"
            value={name}
            onChange={(event) => onNameChange(event.target.value)}
            className="rounded-2xl border border-white/15 bg-black/20 px-4 py-3 text-white placeholder:text-white/40"
            placeholder="Bijvoorbeeld: Vakantie 2025"
          />
        </label>

        <label className="flex flex-col gap-2 text-sm font-medium">
          Beschrijving
          <textarea
            value={description}
            onChange={(event) => onDescriptionChange(event.target.value)}
            rows={3}
            className="rounded-2xl border border-white/15 bg-black/20 px-4 py-3 text-white placeholder:text-white/40"
            placeholder="Korte toelichting bij deze collectie"
          />
        </label>

        <label className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white/80">
          <input
            type="checkbox"
            checked={isPublic}
            onChange={(event) => onIsPublicChange(event.target.checked)}
          />
          Zichtbaar voor kijkers
        </label>

        <div className="flex flex-wrap gap-3">
          <button
            type="submit"
            className="theme-pill-button rounded-full px-4 py-2 text-sm font-semibold"
          >
            {isEditing ? "Wijzigingen opslaan" : "Collectie toevoegen"}
          </button>

          {isEditing && (
            <button
              type="button"
              onClick={onCancel}
              className="theme-pill-button rounded-full px-4 py-2 text-sm font-semibold"
            >
              Annuleren
            </button>
          )}
        </div>
      </div>
    </form>
  );
}
