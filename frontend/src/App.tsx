import { NavLink, Route, Routes } from "react-router-dom";

import { ProtectedRoute } from "./components/auth/ProtectedRoute";
import { RoleRoute } from "./components/auth/RoleRoute";
import { useAuth } from "./hooks/useAuth";
import { useTheme } from "./hooks/useTheme";
import { AdminPage } from "./pages/AdminPage";
import { LoginPage } from "./pages/LoginPage";
import { SlideshowPage } from "./pages/SlideshowPage";

export default function App() {
  const { isAuthenticated, isAdmin, logout, user } = useAuth();
  const { theme, setTheme } = useTheme();

  async function handleLogout() {
    try {
      await logout();
    } catch {
      // useAuth already stores the error state
    }
  }

  return (
    <div className="min-h-screen">
      <nav className="pointer-events-none fixed inset-x-0 top-0 z-20">
        <div className="mx-auto flex w-full max-w-7xl justify-between px-4 py-4 sm:px-6 lg:px-8">
          <div className="theme-shell pointer-events-auto flex items-center gap-1 rounded-full border p-1.5 shadow-[0_18px_50px_rgba(0,0,0,0.3)] backdrop-blur-md">
            <button
              type="button"
              onClick={() => setTheme("standaard")}
              className={`rounded-full px-3 py-2 text-xs font-semibold uppercase tracking-[0.14em] ${
                theme === "standaard"
                  ? "theme-pill-button-active"
                  : "theme-pill-button"
              }`}
            >
              Standaard
            </button>
            <button
              type="button"
              onClick={() => setTheme("madeliefjes")}
              className={`rounded-full px-3 py-2 text-xs font-semibold uppercase tracking-[0.14em] ${
                theme === "madeliefjes"
                  ? "theme-pill-button-active"
                  : "theme-pill-button"
              }`}
            >
              Madeliefjes
            </button>
          </div>

          {isAuthenticated && (
            <div className="theme-shell pointer-events-auto flex items-center gap-2 rounded-full border p-2 shadow-[0_18px_50px_rgba(0,0,0,0.3)] backdrop-blur-md">
              <NavLink
                to="/"
                end
                className={({ isActive }) =>
                  `rounded-full px-4 py-2 text-sm font-semibold ${
                    isActive ? "theme-pill-button-active" : "theme-pill-button"
                  }`
                }
              >
                Fotolijst
              </NavLink>

              {isAdmin && (
                <NavLink
                  to="/admin"
                  className={({ isActive }) =>
                    `rounded-full px-4 py-2 text-sm font-semibold ${
                      isActive
                        ? "theme-pill-button-active"
                        : "theme-pill-button"
                    }`
                  }
                >
                  Beheer
                </NavLink>
              )}

              <div className="hidden items-center gap-2 pl-2 sm:flex">
                <span className="rounded-full border border-white/10 bg-white/8 px-3 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-white/70">
                  {user?.role}
                </span>
                <button
                  type="button"
                  onClick={() => void handleLogout()}
                  className="theme-pill-button rounded-full px-4 py-2 text-sm font-semibold"
                >
                  Uitloggen
                </button>
              </div>
            </div>
          )}
        </div>
      </nav>

      <Routes>
        <Route path="/login" element={<LoginPage />} />

        <Route
          path="/"
          element={
            <ProtectedRoute>
              <SlideshowPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin"
          element={
            <ProtectedRoute>
              <RoleRoute allowedRole="admin">
                <AdminPage />
              </RoleRoute>
            </ProtectedRoute>
          }
        />
      </Routes>
    </div>
  );
}
