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
        <div className="mx-auto flex w-full max-w-7xl flex-col gap-2 px-3 pt-3 sm:flex-row sm:justify-between sm:gap-3 sm:px-6 sm:py-4 lg:px-8">
          <div className="theme-shell pointer-events-auto flex w-full max-w-full items-center gap-1 overflow-x-auto rounded-[1.4rem] border p-1.5 shadow-[0_18px_50px_rgba(0,0,0,0.3)] backdrop-blur-md sm:w-auto sm:rounded-full">
            <button
              type="button"
              onClick={() => setTheme("standaard")}
              className={`min-h-11 flex-1 rounded-full px-2 py-2 text-[0.68rem] font-semibold uppercase tracking-[0.12em] whitespace-nowrap sm:flex-none sm:px-3 sm:text-xs sm:tracking-[0.14em] ${
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
              className={`min-h-11 flex-1 rounded-full px-2 py-2 text-[0.68rem] font-semibold uppercase tracking-[0.12em] whitespace-nowrap sm:flex-none sm:px-3 sm:text-xs sm:tracking-[0.14em] ${
                theme === "madeliefjes"
                  ? "theme-pill-button-active"
                  : "theme-pill-button"
              }`}
            >
              Madeliefjes
            </button>
            <button
              type="button"
              onClick={() => setTheme("eenhoorn")}
              className={`min-h-11 flex-1 rounded-full px-2 py-2 text-[0.68rem] font-semibold uppercase tracking-[0.12em] whitespace-nowrap sm:flex-none sm:px-3 sm:text-xs sm:tracking-[0.14em] ${
                theme === "eenhoorn"
                  ? "theme-pill-button-active"
                  : "theme-pill-button"
              }`}
            >
              EENHOORN
            </button>
          </div>

          {isAuthenticated && (
            <div className="theme-shell pointer-events-auto flex w-full items-center gap-2 rounded-[1.4rem] border p-1.5 shadow-[0_18px_50px_rgba(0,0,0,0.3)] backdrop-blur-md sm:w-auto sm:rounded-full sm:p-2">
              <NavLink
                to="/"
                end
                className={({ isActive }) =>
                  `min-h-11 flex-1 rounded-full px-3 py-2 text-center text-sm font-semibold sm:flex-none sm:px-4 ${
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
                    `min-h-11 flex-1 rounded-full px-3 py-2 text-center text-sm font-semibold sm:flex-none sm:px-4 ${
                      isActive
                        ? "theme-pill-button-active"
                        : "theme-pill-button"
                    }`
                  }
                >
                  Beheer
                </NavLink>
              )}

              <button
                type="button"
                onClick={() => void handleLogout()}
                className="theme-pill-button min-h-11 flex-1 rounded-full px-3 py-2 text-sm font-semibold sm:hidden"
              >
                Uit
              </button>

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
