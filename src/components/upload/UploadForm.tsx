import { FormEvent, useEffect, useState } from "react";

// Component voor het uploaden van een nieuwe foto, inclusief bestandsselectie, titel, beschrijving en preview.
type UploadFormProps = {
  onSubmit: (file: File, title?: string, description?: string) => Promise<void>;
};

// Validaties voor het bestandstype en de bestandsgrootte worden uitgevoerd bij het selecteren van een bestand.
export function UploadForm({ onSubmit }: UploadFormProps) {
  const [file, setFile] = useState<File | null>(null);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Genereert een tijdelijke URL voor de geselecteerde afbeelding om een preview weer te geven. Deze URL wordt opgeruimd wanneer het bestand verandert of wanneer de component wordt ontmanteld.
  useEffect(() => {
    if (!file) {
      setPreviewUrl(null);
      return;
    }

    const objectUrl = URL.createObjectURL(file);
    setPreviewUrl(objectUrl);

    return () => URL.revokeObjectURL(objectUrl);
  }, [file]);

  // Handelt het wijzigen van het bestand in het invoerveld af. Het valideert of het geselecteerde bestand een afbeelding is en of het niet groter is dan 5 MB. Bij een fout worden de foutmelding en het bestand gereset.
  function handleFileChange(event: React.ChangeEvent<HTMLInputElement>) {
    const selectedFile = event.target.files?.[0] ?? null;

    if (!selectedFile) {
      setFile(null);
      setError(null);
      return;
    }

    if (!selectedFile.type.startsWith("image/")) {
      setFile(null);
      setError("Ongeldig bestandstype. Kies een afbeelding.");
      return;
    }

    if (selectedFile.size > 5 * 1024 * 1024) {
      setFile(null);
      setError("Bestand is te groot. Maximaal 5 MB.");
      return;
    }

    setFile(selectedFile);
    setError(null);
  }

  // Handelt het indienen van het formulier af. Het valideert of er een bestand is geselecteerd en roept de onSubmit-functie aan met het bestand, de titel en de beschrijving. Bij een fout wordt een foutmelding weergegeven.
  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!file) {
      setError("Kies eerst een afbeelding.");
      return;
    }

    try {
      setIsSubmitting(true);
      setError(null);
      await onSubmit(file, title, description);
      setFile(null);
      setTitle("");
      setDescription("");
    } catch {
      setError("Upload mislukt. Probeer het opnieuw.");
    } finally {
      setIsSubmitting(false);
    }
  }

  // Het formulier bevat invoervelden voor het selecteren van een afbeelding, het invoeren van een titel en een beschrijving, en een preview van de geselecteerde afbeelding. Er worden ook foutmeldingen weergegeven bij ongeldige invoer of uploadfouten, en de submit-knop is uitgeschakeld tijdens het uploaden.
  return (
    <form
      onSubmit={handleSubmit}
      className="w-full max-w-3xl rounded-3xl border border-white/10 bg-white/5 p-6 text-white shadow-[0_20px_60px_rgba(0,0,0,0.25)] backdrop-blur"
    >
      <div className="flex flex-col gap-5">
        <div>
          <h2 className="text-2xl font-semibold">Foto toevoegen</h2>
          <p className="mt-1 text-sm text-white/70">
            Kies een afbeelding en voeg optioneel een titel en beschrijving toe.
          </p>
        </div>

        <label className="flex flex-col gap-2 text-sm font-medium">
          Afbeelding
          <input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="rounded-2xl border border-white/15 bg-black/20 px-4 py-3 text-sm text-white file:mr-4 file:rounded-full file:border-0 file:bg-white file:px-4 file:py-2 file:text-sm file:font-semibold file:text-black"
          />
        </label>

        <label className="flex flex-col gap-2 text-sm font-medium">
          Titel
          <input
            type="text"
            value={title}
            onChange={(event) => setTitle(event.target.value)}
            placeholder="Bijvoorbeeld: Zomerdag in de tuin"
            className="rounded-2xl border border-white/15 bg-black/20 px-4 py-3 text-white placeholder:text-white/40"
          />
        </label>

        <label className="flex flex-col gap-2 text-sm font-medium">
          Beschrijving
          <textarea
            value={description}
            onChange={(event) => setDescription(event.target.value)}
            placeholder="Korte toelichting bij de foto"
            rows={4}
            className="rounded-2xl border border-white/15 bg-black/20 px-4 py-3 text-white placeholder:text-white/40"
          />
        </label>

        {previewUrl && (
          <div className="overflow-hidden rounded-3xl border border-white/10 bg-black/20">
            <img
              src={previewUrl}
              alt="Preview van upload"
              className="max-h-80 w-full object-contain"
            />
            <div className="border-t border-white/10 px-4 py-3 text-sm text-white/70">
              {file?.name}
            </div>
          </div>
        )}

        {error && (
          <p className="rounded-2xl border border-red-400/30 bg-red-500/10 px-4 py-3 text-sm text-red-100">
            {error}
          </p>
        )}

        <button
          type="submit"
          disabled={isSubmitting}
          className="rounded-full bg-white px-5 py-3 font-semibold text-black transition-opacity disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isSubmitting ? "Bezig met uploaden..." : "Foto toevoegen"}
        </button>
      </div>
    </form>
  );
}
