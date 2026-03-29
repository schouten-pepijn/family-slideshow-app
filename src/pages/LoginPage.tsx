import { FormEvent, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import { useAuth } from "../hooks/useAuth";

export function LoginPage() {
  const navigate = useNavigate();
  const { login, isAuthenticated, isLoading, error } = useAuth();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  useEffect(() => {
    if (!isLoading && isAuthenticated) {
      void navigate("/", { replace: true });
    }
  }, [isAuthenticated, isLoading, navigate]);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!username.trim() || !password.trim()) {
      setFormError("Vul zowel een gebruikersnaam als wachtwoord in.");
      return;
    }

    try {
      setIsSubmitting(true);
      setFormError(null);
      await login(username.trim(), password);
      void navigate("/", { replace: true });
    } catch (err) {
      setFormError(err instanceof Error ? err.message : "Inloggen is mislukt.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="flex min-h-screen items-center px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto grid w-full max-w-6xl gap-10 lg:grid-cols-[1.15fr_0.85fr] lg:items-center">
        <section className="space-y-6 text-white">
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-white/45">
            Private Family Slideshow
          </p>
          <h1 className="max-w-3xl text-4xl font-semibold tracking-tight sm:text-5xl lg:text-6xl">
            Meld je aan om de fotolijst te bekijken of beheren.
          </h1>
          <p className="max-w-2xl text-sm leading-7 text-white/70 sm:text-base">
            De slideshow en het beheer zijn alleen beschikbaar voor de gedeelde
            accounts <span className="font-semibold text-white">viewer</span>{" "}
            en <span className="font-semibold text-white">admin</span>.
          </p>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="rounded-[1.75rem] border border-white/10 bg-white/6 p-5 shadow-[0_24px_60px_rgba(0,0,0,0.25)] backdrop-blur-md">
              <p className="text-sm font-semibold text-white">Viewer</p>
              <p className="mt-2 text-sm leading-6 text-white/65">
                Kan de slideshow en alle foto’s bekijken.
              </p>
            </div>
            <div className="rounded-[1.75rem] border border-white/10 bg-white/6 p-5 shadow-[0_24px_60px_rgba(0,0,0,0.25)] backdrop-blur-md">
              <p className="text-sm font-semibold text-white">Admin</p>
              <p className="mt-2 text-sm leading-6 text-white/65">
                Kan daarnaast uploaden, bewerken, activeren en verwijderen.
              </p>
            </div>
          </div>
        </section>

        <section className="rounded-[2rem] border border-white/10 bg-black/30 p-6 shadow-[0_30px_80px_rgba(0,0,0,0.35)] backdrop-blur-md sm:p-8">
          <div className="mb-6">
            <p className="text-xs font-semibold uppercase tracking-[0.28em] text-white/45">
              Inloggen
            </p>
            <h2 className="mt-3 text-2xl font-semibold tracking-tight text-white sm:text-3xl">
              Toegang tot de app
            </h2>
          </div>

          <form className="space-y-5" onSubmit={handleSubmit}>
            <div className="space-y-2">
              <label
                className="text-sm font-medium text-white/80"
                htmlFor="username"
              >
                Gebruikersnaam
              </label>
              <input
                id="username"
                name="username"
                type="text"
                autoComplete="username"
                value={username}
                onChange={(event) => setUsername(event.target.value)}
                className="w-full rounded-2xl border border-white/10 bg-white/8 px-4 py-3 text-white outline-none transition focus:border-white/25 focus:bg-white/10"
                placeholder="admin of viewer"
              />
            </div>

            <div className="space-y-2">
              <label
                className="text-sm font-medium text-white/80"
                htmlFor="password"
              >
                Wachtwoord
              </label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                className="w-full rounded-2xl border border-white/10 bg-white/8 px-4 py-3 text-white outline-none transition focus:border-white/25 focus:bg-white/10"
                placeholder="Wachtwoord"
              />
            </div>

            {(formError || error) && (
              <p className="rounded-2xl border border-red-400/30 bg-red-500/10 px-4 py-3 text-sm text-red-100">
                {formError ?? error}
              </p>
            )}

            <button
              type="submit"
              disabled={isSubmitting || isLoading}
              className="w-full rounded-2xl bg-white px-4 py-3 text-sm font-semibold text-black transition hover:bg-white/90 disabled:cursor-not-allowed disabled:bg-white/50"
            >
              {isSubmitting ? "Bezig met inloggen..." : "Inloggen"}
            </button>
          </form>
        </section>
      </div>
    </div>
  );
}
