import { useEffect, useMemo, useState } from "react";

// Defines the structure of a Photo object with id, title, and url properties.
type Photo = {
  id: string;
  title: string;
  description?: string;
  url: string;
};

const defaultPhotoValues = {
  description: "No description available",
};

// Initial set of photos to be displayed in the slideshow, each with a unique id, title, and URL pointing to an image.
const initialPhotos: Photo[] = [
  {
    id: "1",
    title: "Sample Photo 1",
    description: "This is a sample description",
    url: "https://picsum.photos/id/1015/1200/800",
  },
  {
    id: "2",
    title: "Sample Photo 2",
    description: "This is also a sample description",
    url: "https://picsum.photos/id/1025/1200/800",
  },
  {
    id: "3",
    title: "Sample Photo 3",
    url: "https://picsum.photos/id/1035/1200/800",
  },
];

// Main App component that renders a photo slideshow with auto-rotation and manual controls for navigating through the photos.
export default function App() {
  // State to hold the list of photos and the index of the currently active photo. The active photo is derived using useMemo for performance optimization.
  const [photos] = useState<Photo[]>(initialPhotos);
  const [activeIndex, setActiveIndex] = useState(0);
  const activePhoto = useMemo(() => photos[activeIndex], [photos, activeIndex]);

  // useEffect hook to set up an interval that automatically advances the active photo every 8 seconds. The interval is cleared when the component unmounts or when the number of photos changes.
  useEffect(() => {
    const timer = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % photos.length);
    }, 8000);

    return () => clearInterval(timer);
  }, [photos.length]);

  return (
    <div className="min-h-screen flex flex-col gap-6 p-8">
      <header className="text-center">
        <h1 className="text-2xl font-bold text-white">
          Pepijns Sample Slideshow
        </h1>
        <p className="text-white/75 mt-1">
          Gebruik de knoppen hieronder om door de foto's te bladeren, of wacht
          tot de automatische rotatie.
        </p>
      </header>

      <main className="flex flex-col items-center gap-6 max-w-[920px] w-full mx-auto">
        <div className="relative w-full rounded-2xl overflow-hidden shadow-[0_20px_40px_rgba(0,0,0,0.5)]">
          <img
            className="w-full h-auto block object-cover"
            src={activePhoto.url}
            alt={activePhoto.title}
          />
          <div className="absolute bottom-0 left-0 right-0 px-5 py-4 bg-black/45 flex justify-between items-start text-white text-[0.95rem]">
            <strong>{activePhoto.title}</strong>
            <span className="text-[0.85rem] text-white/75 text-center whitespace-nowrap pointer-events-none">
              {activePhoto.description ?? defaultPhotoValues.description}
            </span>
            <span className="text-[0.9rem]">
              {activeIndex + 1} / {photos.length}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            className="px-5 py-3 rounded-full border border-white/20 bg-white/8 text-white font-semibold cursor-pointer transition-all duration-150 hover:bg-white/14 hover:-translate-y-px active:translate-y-0"
            onClick={() =>
              setActiveIndex((idx) => (idx - 1 + photos.length) % photos.length)
            }
          >
            Vorige
          </button>
          <button
            type="button"
            className="px-5 py-3 rounded-full border border-white/20 bg-white/8 text-white font-semibold cursor-pointer transition-all duration-150 hover:bg-white/14 hover:-translate-y-px active:translate-y-0"
            onClick={() => setActiveIndex((idx) => (idx + 1) % photos.length)}
          >
            Volgende
          </button>
        </div>
      </main>

      <footer className="text-center text-white/75 text-[0.9rem]">
        <p>
          Vervang deze voorbeeldslideshow door uw eigen gegevens en lay-out.
        </p>
      </footer>
    </div>
  );
}
