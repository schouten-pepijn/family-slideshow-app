import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";

import {
  login as logingRequest,
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

const [user, setUser] = useState<AuthUser | null>(null);
const [isLoading, setIsLoading] = useState(true);
const [error, setError] = useState<string | null>(null);
