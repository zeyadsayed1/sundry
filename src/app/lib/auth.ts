import type { JWTPayload, UserSession } from "@/app/lib/types";
import {
  decryptToken,
  encryptToken,
  isTokenEncrypted,
} from "@/app/lib/token-crypto";

export type { JWTPayload, UserSession } from "@/app/lib/types";

const TOKEN_KEY = "userToken";
const USER_KEY = "userData";

export function decodeJWT(token: string): JWTPayload | null {
  try {
    const base64Url = token.split(".")[1];
    if (!base64Url) return null;
    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split("")
        .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
        .join("")
    );
    return JSON.parse(jsonPayload) as JWTPayload;
  } catch (error) {
    console.error("Failed to decode token:", error);
    return null;
  }
}

export function isTokenExpired(token: string): boolean {
  const decoded = decodeJWT(token);
  if (!decoded?.exp) return false;
  return Date.now() >= decoded.exp * 1000;
}

export async function storeAuthSession(
  token: string,
  user?: UserSession
): Promise<void> {
  if (typeof window === "undefined") return;

  try {
    const encryptedToken = await encryptToken(token);
    localStorage.setItem(TOKEN_KEY, encryptedToken);
    if (user) {
      localStorage.setItem(USER_KEY, JSON.stringify(user));
    }
    window.dispatchEvent(new Event("storage"));
  } catch (error) {
    console.error("Failed to store auth session:", error);
  }
}

export async function getStoredToken(): Promise<string | null> {
  if (typeof window === "undefined") return null;

  try {
    const storedValue = localStorage.getItem(TOKEN_KEY);
    if (!storedValue) return null;

    const token = await decryptToken(storedValue);
    if (!token) {
      clearAuthSession();
      return null;
    }

    if (isTokenExpired(token)) {
      clearAuthSession();
      return null;
    }

    if (!isTokenEncrypted(storedValue)) {
      localStorage.setItem(TOKEN_KEY, await encryptToken(token));
    }

    return token;
  } catch {
    return null;
  }
}

export function getStoredUser(): UserSession | null {
  if (typeof window === "undefined") return null;

  try {
    const data = localStorage.getItem(USER_KEY);
    if (!data) return null;
    return JSON.parse(data) as UserSession;
  } catch {
    return null;
  }
}

export function clearAuthSession(): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
    window.dispatchEvent(new Event("storage"));
  } catch (error) {
    console.error("Failed to clear auth session:", error);
  }
}
