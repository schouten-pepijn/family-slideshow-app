const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL ?? "").replace(/\/$/, "");
const AUTH_TOKEN_STORAGE_KEY = "slideshow.authToken";

export function buildApiUrl(path: string): string {
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;

  if (!API_BASE_URL) {
    return normalizedPath;
  }

  return `${API_BASE_URL}${normalizedPath}`;
}

export function getAuthToken(): string | null {
  if (typeof window === "undefined") {
    return null;
  }

  return window.localStorage.getItem(AUTH_TOKEN_STORAGE_KEY);
}

export function setAuthToken(token: string): void {
  window.localStorage.setItem(AUTH_TOKEN_STORAGE_KEY, token);
}

export function clearAuthToken(): void {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.removeItem(AUTH_TOKEN_STORAGE_KEY);
}

export function buildAuthHeaders(headers: HeadersInit = {}): Headers {
  const authHeaders = new Headers(headers);
  const token = getAuthToken();

  if (token) {
    authHeaders.set("Authorization", `Bearer ${token}`);
  }

  return authHeaders;
}

function pointsAtApi(url: string): boolean {
  return (
    url.startsWith("/api/") ||
    Boolean(API_BASE_URL && url.startsWith(`${API_BASE_URL}/api/`))
  );
}

function appendAccessToken(url: string): string {
  const token = getAuthToken();

  if (!token || !pointsAtApi(url)) {
    return url;
  }

  const separator = url.includes("?") ? "&" : "?";
  return `${url}${separator}access_token=${encodeURIComponent(token)}`;
}

export function resolveAssetUrl(
  url: string,
  options?: { includeAuthToken?: boolean },
): string {
  const resolvedUrl =
    url.startsWith("http://") || url.startsWith("https://")
      ? url
      : buildApiUrl(url);

  if (options?.includeAuthToken) {
    return appendAccessToken(resolvedUrl);
  }

  return resolvedUrl;
}
