const ADMIN_TOKEN_KEY = "adminAccessToken";
const ADMIN_AUTH_EVENT = "admin-auth-changed";

export function getAdminToken(): string | null {
  return localStorage.getItem(ADMIN_TOKEN_KEY);
}

export function saveAdminToken(token: string): void {
  localStorage.setItem(ADMIN_TOKEN_KEY, token);

  window.dispatchEvent(new Event(ADMIN_AUTH_EVENT));
}

export function getAdminTokenExpiration(): number | null {
  const token = getAdminToken();

  if (!token) return null;

  try {
    const payload = token.split(".")[1];

    if (!payload) return null;

    const base64 = payload.replace(/-/g, "+").replace(/_/g, "/");
    const decoded = JSON.parse(atob(base64));

    if (typeof decoded.exp !== "number") {
      return null;
    }

    return decoded.exp * 1000;
  } catch {
    return null;
  }
}

export function isAdminAuthenticated(): boolean {
  const token = getAdminToken();
  const expiration = getAdminTokenExpiration();

  return Boolean(token) && expiration !== null && Date.now() < expiration;
}

export function adminLogout(): void {
  localStorage.removeItem(ADMIN_TOKEN_KEY);

  window.dispatchEvent(new Event(ADMIN_AUTH_EVENT));
}

export function subscribeToAdminAuth(callback: () => void): () => void {
  window.addEventListener(ADMIN_AUTH_EVENT, callback);
  window.addEventListener("storage", callback);

  return () => {
    window.removeEventListener(ADMIN_AUTH_EVENT, callback);
    window.removeEventListener("storage", callback);
  };
}
