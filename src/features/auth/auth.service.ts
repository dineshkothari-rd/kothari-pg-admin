import type { LoginCredentials } from "./auth.types";

const ADMIN_EMAIL = "admin@kothari.com";
const ADMIN_PASSWORD = "123456";

export function login({ email, password }: LoginCredentials) {
  if (email === ADMIN_EMAIL && password === ADMIN_PASSWORD) {
    localStorage.setItem("auth_token", "admin_token");

    return true;
  }

  return false;
}

export function logout() {
  localStorage.removeItem("auth_token");
}

export function isAuthenticated() {
  return Boolean(localStorage.getItem("auth_token"));
}
