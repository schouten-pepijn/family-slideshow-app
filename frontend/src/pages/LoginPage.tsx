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
    <div className="login-page flex min-h-screen items-center px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto grid w-full max-w-6xl gap-8 lg:grid-cols-[1.05fr_0.95fr] lg:items-stretch lg:gap-10">
        <section className="login-hero-copy flex flex-col justify-center text-white">
          <div className="space-y-5">
            <p className="font-ui text-xs font-semibold uppercase tracking-[0.32em] text-white/48">
              Digitaal fotolijstje
            </p>
            <h1 className="display-hero max-w-3xl text-4xl font-semibold sm:text-5xl lg:text-6xl">
              Welkom bij het digitale fotolijstje van de familie
            </h1>
            <p className="font-ui max-w-2xl text-sm leading-7 text-white/66 sm:text-base">
              Een rustige plek voor jullie mooiste momenten, met snelle toegang
              voor kijken en beheren.
            </p>
          </div>
          <div className="mt-7 grid gap-4 sm:grid-cols-2">
            <article className="login-role-card rounded-[1.25rem] border border-white/12 bg-white/[0.07] p-5 shadow-[0_24px_60px_rgba(0,0,0,0.22)] backdrop-blur-md">
              <p className="font-ui text-sm font-semibold text-white">Kijker</p>
              <p className="font-ui mt-2 text-sm leading-6 text-white/68">
                Kan de slideshow met geselecteerde foto's bekijken.
              </p>
            </article>
            <article className="login-role-card rounded-[1.25rem] border border-white/12 bg-white/[0.07] p-5 shadow-[0_24px_60px_rgba(0,0,0,0.22)] backdrop-blur-md">
              <p className="font-ui text-sm font-semibold text-white">
                Beheerder
              </p>
              <p className="font-ui mt-2 text-sm leading-6 text-white/68">
                Kan uploaden, bewerken, activeren en verwijderen.
              </p>
            </article>
          </div>
        </section>

        <section className="flex items-center lg:justify-end">
          <div className="login-card theme-shell w-full rounded-[1.8rem] border p-6 shadow-[0_32px_72px_rgba(0,0,0,0.35)] backdrop-blur-lg sm:max-w-[30rem] sm:p-8">
            <div className="mb-6 border-b border-white/10 pb-4">
              <p className="font-ui text-xs font-semibold uppercase tracking-[0.3em] text-white/46">
                Inloggen
              </p>
              <h2 className="display-page-title mt-2 text-2xl font-semibold text-white sm:text-[2rem]">
                Toegang tot de app
              </h2>
            </div>
            <form className="space-y-5" onSubmit={handleSubmit}>
              <div className="space-y-2.5">
                <label
                  className="font-ui text-sm font-semibold tracking-[0.01em] text-white/82"
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
                  className="font-ui w-full rounded-2xl border border-white/12 bg-white/[0.08] px-4 py-3.5 text-[1.02rem] text-white outline-none transition placeholder:text-white/40 focus:border-white/28 focus:bg-white/[0.11]"
                  placeholder="Gebruikersnaam"
                />
              </div>

              <div className="space-y-2.5">
                <label
                  className="font-ui text-sm font-semibold tracking-[0.01em] text-white/82"
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
                  className="font-ui w-full rounded-2xl border border-white/12 bg-white/[0.08] px-4 py-3.5 text-[1.02rem] text-white outline-none transition placeholder:text-white/40 focus:border-white/28 focus:bg-white/[0.11]"
                  placeholder="Wachtwoord"
                />
              </div>

              {(formError || error) && (
                <p className="font-ui rounded-2xl border border-red-400/30 bg-red-500/10 px-4 py-3 text-sm text-red-100">
                  {formError ?? error}
                </p>
              )}

              <button
                type="submit"
                disabled={isSubmitting || isLoading}
                className="theme-pill-button font-ui w-full rounded-2xl px-4 py-3.5 text-sm font-semibold tracking-[0.01em] disabled:cursor-not-allowed disabled:opacity-60"
              >
                {isSubmitting ? "Bezig met inloggen..." : "Inloggen"}
              </button>
            </form>
          </div>
        </section>
      </div>
    </div>
  );
}
