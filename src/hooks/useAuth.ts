import {
  createElement,
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";

import {
  login as loginRequest,
  logout as logoutRequest,
  fetchCurrentUser,
} from "../api/auth";
import type { AuthUser } from "../types/auth";

type UseAuthResult = {
  user: AuthUser | null;
  isLoading: boolean;
  error: string | null;
  login: (username: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
  isAuthenticated: boolean;
  isAdmin: boolean;
};

const AuthContext = createContext<UseAuthResult | null>(null);

function useAuthState(): UseAuthResult {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  async function refreshUser() {
    try {
      setError(null);
      const currentUser = await fetchCurrentUser();
      setUser(currentUser);
    } catch {
      setError("Gebruiker ophalen mislukt.");
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  }

  async function login(username: string, password: string) {
    try {
      setError(null);
      const currentUser = await loginRequest(username, password);
      setUser(currentUser);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Inloggen mislukt.");
      throw err;
    }
  }

  async function logout() {
    try {
      setError(null);
      await logoutRequest();
      setUser(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Uitloggen mislukt.");
      throw err;
    }
  }

  useEffect(() => {
    void refreshUser();
  }, []);

  return {
    user,
    isLoading,
    error,
    login,
    logout,
    refreshUser,
    isAuthenticated: user !== null,
    isAdmin: user?.role === "admin",
  };
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const value = useAuthState();
  return createElement(AuthContext.Provider, { value }, children);
}

export function useAuth(): UseAuthResult {
  const context = useContext(AuthContext);
  if (!context)
    throw new Error("useAuth must be used within an AuthProvider");

  return context;
}
