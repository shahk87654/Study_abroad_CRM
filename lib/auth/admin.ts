import type { UserProfile } from "@/types";

export const ADMIN_SESSION_COOKIE = "gg_admin_session";
export const ADMIN_EMAIL = "testadmin@globalgrads.local";
export const ADMIN_ID = "00000000-0000-0000-0000-000000000001";

const ADMIN_PASSWORD_SALT = "global-grads-admin-login-v1";
const ADMIN_PASSWORD_HASH = "nb1BTH+A3ialxUo4EQB1quR/ir7a80lq9uMTNkO6QbE=";
const ADMIN_SESSION_TTL_SECONDS = 60 * 60 * 8;
const SESSION_SECRET =
  process.env.ADMIN_SESSION_SECRET ?? "global-grads-local-admin-session-secret-change-before-production";

export const ADMIN_PROFILE: UserProfile = {
  id: ADMIN_ID,
  email: ADMIN_EMAIL,
  full_name: "Admin",
  role: "admin",
  avatar_url: null,
  created_at: new Date(0).toISOString(),
};

export async function verifyAdminCredentials(email: string, password: string) {
  if (email.trim().toLowerCase() !== ADMIN_EMAIL) {
    return false;
  }

  const passwordHash = await pbkdf2(password, ADMIN_PASSWORD_SALT);
  return constantTimeEqual(passwordHash, base64ToBytes(ADMIN_PASSWORD_HASH));
}

export async function createAdminSessionToken() {
  const expiresAt = Math.floor(Date.now() / 1000) + ADMIN_SESSION_TTL_SECONDS;
  const payload = `${ADMIN_ID}.${expiresAt}`;
  const signature = await hmac(payload);
  return `${expiresAt}.${base64UrlEncode(signature)}`;
}

export async function verifyAdminSession(token?: string) {
  if (!token) {
    return false;
  }

  const [expiresAtRaw, signatureRaw] = token.split(".");
  const expiresAt = Number(expiresAtRaw);

  if (!Number.isFinite(expiresAt) || expiresAt <= Math.floor(Date.now() / 1000) || !signatureRaw) {
    return false;
  }

  const expected = await hmac(`${ADMIN_ID}.${expiresAt}`);
  return constantTimeEqual(base64UrlDecode(signatureRaw), expected);
}

async function pbkdf2(password: string, salt: string) {
  const keyMaterial = await crypto.subtle.importKey("raw", encode(password), "PBKDF2", false, ["deriveBits"]);
  const bits = await crypto.subtle.deriveBits(
    {
      name: "PBKDF2",
      hash: "SHA-256",
      salt: encode(salt),
      iterations: 210_000,
    },
    keyMaterial,
    256,
  );

  return new Uint8Array(bits);
}

async function hmac(payload: string) {
  const key = await crypto.subtle.importKey("raw", encode(SESSION_SECRET), { name: "HMAC", hash: "SHA-256" }, false, [
    "sign",
  ]);
  const signature = await crypto.subtle.sign("HMAC", key, encode(payload));
  return new Uint8Array(signature);
}

function constantTimeEqual(a: Uint8Array, b: Uint8Array) {
  if (a.length !== b.length) {
    return false;
  }

  let difference = 0;
  for (let index = 0; index < a.length; index += 1) {
    difference |= a[index] ^ b[index];
  }
  return difference === 0;
}

function encode(value: string) {
  return new TextEncoder().encode(value);
}

function base64ToBytes(value: string) {
  return Uint8Array.from(atob(value), (char) => char.charCodeAt(0));
}

function base64UrlEncode(bytes: Uint8Array) {
  return btoa(String.fromCharCode(...bytes)).replaceAll("+", "-").replaceAll("/", "_").replaceAll("=", "");
}

function base64UrlDecode(value: string) {
  const padded = value.replaceAll("-", "+").replaceAll("_", "/").padEnd(Math.ceil(value.length / 4) * 4, "=");
  return base64ToBytes(padded);
}
