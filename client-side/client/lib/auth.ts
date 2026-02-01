// Token storage utilities for JWT authentication

const ACCESS_TOKEN_KEY = "access_token";
const REFRESH_TOKEN_KEY = "refresh_token";

export interface Tokens {
  access: string;
  refresh: string;
}

/**
 * Store JWT tokens in localStorage
 */
export const setTokens = (access: string, refresh: string): void => {
  localStorage.setItem(ACCESS_TOKEN_KEY, access);
  localStorage.setItem(REFRESH_TOKEN_KEY, refresh);
};

/**
 * Get stored JWT tokens
 */
export const getTokens = (): Tokens | null => {
  const access = localStorage.getItem(ACCESS_TOKEN_KEY);
  const refresh = localStorage.getItem(REFRESH_TOKEN_KEY);
  
  if (access && refresh) {
    return { access, refresh };
  }
  
  return null;
};

/**
 * Get access token only
 */
export const getAccessToken = (): string | null => {
  return localStorage.getItem(ACCESS_TOKEN_KEY);
};

/**
 * Get refresh token only
 */
export const getRefreshToken = (): string | null => {
  return localStorage.getItem(REFRESH_TOKEN_KEY);
};

/**
 * Clear all stored tokens
 */
export const clearTokens = (): void => {
  localStorage.removeItem(ACCESS_TOKEN_KEY);
  localStorage.removeItem(REFRESH_TOKEN_KEY);
};

/**
 * Check if user is authenticated (has tokens)
 */
export const isAuthenticated = (): boolean => {
  return getTokens() !== null;
};
