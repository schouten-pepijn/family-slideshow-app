import type { AuthUser } from "../types/auth";
import { buildApiUrl } from "../lib/api";

export async function login(
  username: string,
  password: string,
): Promise<AuthUser> {
  const response = await fetch(buildApiUrl("/api/auth/login"), {
    method: "POST",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ username, password }),
  });

  if (!response.ok) {
    const data = await response.json().catch(() => null);
    throw new Error(data?.detail ?? "Inloggen mislukt.");
  }

  return response.json();
}

export async function logout(): Promise<void> {
  const response = await fetch(buildApiUrl("/api/auth/logout"), {
    method: "POST",
    credentials: "include",
  });

  if (!response.ok) {
    throw new Error("Uitloggen mislukt.");
  }
}

export async function fetchCurrentUser(): Promise<AuthUser | null> {
  const response = await fetch(buildApiUrl("/api/auth/me"), {
    method: "GET",
    credentials: "include",
  });

  if (response.status === 401) {
    return null;
  }

  if (!response.ok) {
    throw new Error("Gebruiker ophalen mislukt.");
  }

  return response.json();
}
