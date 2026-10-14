import { betterAuth, type BetterAuthOptions } from "better-auth";
import { getDb } from "./db";
export function authOptions(bootstrap = false): BetterAuthOptions {
  const secret = process.env.BETTER_AUTH_SECRET;
  if (!secret || secret.length < 32)
    throw new Error(
      "Jalankan npm run setup untuk konfigurasi autentikasi lokal.",
    );
  return {
    database: getDb(),
    secret,
    baseURL: process.env.APP_URL || "http://127.0.0.1:3000",
    trustedOrigins:
      process.env.NODE_ENV === "production"
        ? [process.env.APP_URL || "http://127.0.0.1:3000"]
        : ["http://127.0.0.1:3000", "http://localhost:3000"],
    emailAndPassword: {
      enabled: true,
      disableSignUp: !bootstrap,
      minPasswordLength: 12,
    },
    session: {
      expiresIn: 60 * 60 * 8,
      updateAge: 60 * 60 * 8,
      cookieCache: { enabled: false },
    },
    rateLimit: {
      enabled: true,
      storage: "database" as const,
      window: 60,
      max: 30,
      customRules: { "/sign-in/email": { window: 900, max: 5 } },
    },
    advanced: {
      useSecureCookies: process.env.APP_URL?.startsWith("https://") || false,
    },
  };
}
let authInstance: ReturnType<typeof betterAuth>;
export function getAuth() {
  return (authInstance ||= betterAuth(authOptions()));
}
