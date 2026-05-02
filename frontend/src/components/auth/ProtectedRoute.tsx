import type { ReactNode } from "react";
import { Navigate, useLocation } from "react-router-dom";

import { useAuth } from "../../hooks/useAuth";

type ProtectedRouteProps = {
  children: ReactNode;
};

export function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { isAuthenticated, isLoading } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return (
      <div className="theme-page flex min-h-screen items-center px-4 py-8 text-white sm:px-6 lg:px-8">
        <div className="mx-auto w-full max-w-3xl rounded-[2rem] border border-white/10 bg-black/25 px-8 py-14 text-center shadow-[0_30px_80px_rgba(0,0,0,0.35)] backdrop-blur-md">
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-white/45">
            Authenticatie
          </p>
          <h1 className="display-page-title mt-4 text-3xl font-semibold sm:text-4xl">
            Sessie wordt gecontroleerd
          </h1>
          <p className="mt-4 text-sm leading-7 text-white/70 sm:text-base">
            Even geduld, we controleren of je toegang hebt.
          </p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated)
    return <Navigate to="/login" replace state={{ from: location }} />;

  return <>{children}</>;
}
