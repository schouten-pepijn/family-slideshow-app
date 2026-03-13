import { NavLink, Route, Routes } from "react-router-dom";
import { AdminPage } from "./pages/AdminPage";
import { SlideshowPage } from "./pages/SlideshowPage";

export default function App() {
  return (
    <div className="min-h-screen">
      <nav className="sticky top-0 z-10 border-b border-white/10 bg-black/20 backdrop-blur">
        <div className="mx-auto flex w-full max-w-6xl items-center gap-3 px-4 py-4 sm:px-6 lg:px-8">
          <NavLink
            to="/"
            end
            className={({ isActive }) =>
              `rounded-full px-4 py-2 text-sm font-semibold transition-colors ${
                isActive
                  ? "bg-white text-black"
                  : "bg-white/10 text-white hover:bg-white/15"
              }`
            }
          >
            Slideshow
          </NavLink>
          <NavLink
            to="/admin"
            className={({ isActive }) =>
              `rounded-full px-4 py-2 text-sm font-semibold transition-colors ${
                isActive
                  ? "bg-white text-black"
                  : "bg-white/10 text-white hover:bg-white/15"
              }`
            }
          >
            Admin
          </NavLink>
        </div>
      </nav>

      <Routes>
        <Route path="/" element={<SlideshowPage />} />
        <Route path="/admin" element={<AdminPage />} />
      </Routes>
    </div>
  );
}
