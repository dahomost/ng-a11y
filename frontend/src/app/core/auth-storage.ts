/** Session keys — shared with HTTP interceptors to avoid HttpClient ↔ AuthService cycles */
export const AUTH_TOKEN_KEY = 'library_token';
export const AUTH_USER_KEY = 'library_user';

export function readStoredToken(): string | null {
  if (typeof sessionStorage === 'undefined') return null;
  return sessionStorage.getItem(AUTH_TOKEN_KEY);
}
