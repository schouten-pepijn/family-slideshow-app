import { NavLink, Route, Routes, useLocation } from "react-router-dom";
import { AdminPage } from "./pages/AdminPage";
import { SlideshowPage } from "./pages/SlideshowPage";

export default function App() {
  const location = useLocation();
  const isSlideshowRoute = location.pathname === "/";

  return (
    <div className="min-h-screen">
      <nav
        className={
          isSlideshowRoute
            ? "pointer-events-none fixed inset-x-0 top-0 z-20"
            : "sticky top-0 z-20 border-b border-white/10 bg-black/20 backdrop-blur"
        }
      >
        <div
          className={
            isSlideshowRoute
              ? "mx-auto flex w-full max-w-7xl justify-end px-4 py-4 sm:px-6 lg:px-8"
              : "mx-auto flex w-full max-w-6xl items-center gap-3 px-4 py-4 sm:px-6 lg:px-8"
          }
        >
          <div
            className={
              isSlideshowRoute
                ? "pointer-events-auto flex items-center gap-2 rounded-full border border-white/10 bg-black/35 p-2 shadow-[0_18px_50px_rgba(0,0,0,0.3)] backdrop-blur-md"
                : "flex items-center gap-3"
            }
          >
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
        </div>
      </nav>

      <Routes>
        <Route path="/" element={<SlideshowPage />} />
        <Route path="/admin" element={<AdminPage />} />
      </Routes>
    </div>
  );
}
