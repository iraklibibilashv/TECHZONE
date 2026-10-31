
const ADMIN_TOKEN_KEY = "adminAccessToken";
const ADMIN_AUTH_EVENT = "admin-auth-changed";

export function getAdminToken(): string | null {
  return localStorage.getItem(ADMIN_TOKEN_KEY);
}

export function saveAdminToken(token: string): void {
  localStorage.setItem(ADMIN_TOKEN_KEY, token);

  window.dispatchEvent(new Event(ADMIN_AUTH_EVENT));
}

export function isAdminAuthenticated(): boolean {
  return Boolean(getAdminToken());
}

export function adminLogout(): void {
  localStorage.removeItem(ADMIN_TOKEN_KEY);

  window.dispatchEvent(new Event(ADMIN_AUTH_EVENT));
}

export function subscribeToAdminAuth(
  callback: () => void
): () => void {
  window.addEventListener(ADMIN_AUTH_EVENT, callback);
  window.addEventListener("storage", callback);

  return () => {
    window.removeEventListener(ADMIN_AUTH_EVENT, callback);
    window.removeEventListener("storage", callback);
  };
}
