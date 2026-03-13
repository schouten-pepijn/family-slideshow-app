import { useEffect, useMemo, useState } from "react";
import "./App.css";

// Defines the structure of a Photo object with id, title, and url properties.
type Photo = {
  id: string;
  title: string;
  url: string;
};

// Initial set of photos to be displayed in the slideshow, each with a unique id, title, and URL pointing to an image.
const initialPhotos: Photo[] = [
  {
    id: "1",
    title: "Sample Photo 1",
    url: "https://picsum.photos/id/1015/1200/800",
  },
  {
    id: "2",
    title: "Sample Photo 2",
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
    <div className="app">
      <header className="app__header">
        <h1>Pepijns Sample Slideshow</h1>
        <p>
          Gebruik de knoppen hieronder om door de foto's te bladeren, of wacht
          tot de automatische rotatie.
        </p>
      </header>

      <main className="app__content">
        <div className="slideshow">
          <img
            className="slideshow__image"
            src={activePhoto.url}
            alt={activePhoto.title}
          />
          <div className="slideshow__caption">
            <strong>{activePhoto.title}</strong>
            <span>
              {activeIndex + 1} / {photos.length}
            </span>
          </div>
        </div>

        <div className="controls">
          <button
            type="button"
            onClick={() =>
              setActiveIndex((idx) => (idx - 1 + photos.length) % photos.length)
            }
          >
            Vorige
          </button>
          <button
            type="button"
            onClick={() => setActiveIndex((idx) => (idx + 1) % photos.length)}
          >
            Volgende
          </button>
        </div>
      </main>

      <footer className="app__footer">
        <p>
          Vervang deze voorbeeldslideshow door uw eigen gegevens en lay-out.
        </p>
      </footer>
    </div>
  );
}
