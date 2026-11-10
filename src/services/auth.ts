const ACCESS_TOKEN_KEY = "accessToken";
const REFRESH_TOKEN_KEY = "refreshToken";

// SAVE TOKENS
export function saveTokens(accessToken: string, refreshToken: string): void {
  localStorage.setItem(ACCESS_TOKEN_KEY, accessToken);
  localStorage.setItem(REFRESH_TOKEN_KEY, refreshToken);
}

// GET ACCESS TOKEN
export function getAccessToken(): string | null {
  return localStorage.getItem(ACCESS_TOKEN_KEY);
}

// GET REFRESH TOKEN
export function getRefreshToken(): string | null {
  return localStorage.getItem(REFRESH_TOKEN_KEY);
}

// GET TOKEN EXPIRATION
export function getTokenExpiration(): number | null {
  const token = getAccessToken();

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

// CHECK TOKEN EXPIRATION
export function isAccessTokenExpired(): boolean {
  const expiration = getTokenExpiration();

  if (expiration === null) {
    return true;
  }

  return Date.now() >= expiration;
}

// CHECK AUTHENTICATION
export function isAuthenticated(): boolean {
  return Boolean(getAccessToken()) && !isAccessTokenExpired();
}

// LOGOUT
export function logout(): void {
  localStorage.removeItem(ACCESS_TOKEN_KEY);
  localStorage.removeItem(REFRESH_TOKEN_KEY);
}
