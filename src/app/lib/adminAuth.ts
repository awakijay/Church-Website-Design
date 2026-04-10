const ADMIN_SESSION_KEY = "ihnbc-admin-session";

const DEFAULT_ADMIN_USERNAME = "admin";
const DEFAULT_ADMIN_PASSWORD = "qwertyuiop!@#";

type StoredAdminSession = {
  authenticated: boolean;
  username: string;
};

function getConfiguredAdminUsername() {
  return import.meta.env.VITE_ADMIN_USERNAME?.trim() || DEFAULT_ADMIN_USERNAME;
}

function getConfiguredAdminPassword() {
  return import.meta.env.VITE_ADMIN_PASSWORD?.trim() || DEFAULT_ADMIN_PASSWORD;
}

export function getAdminSession() {
  if (typeof window === "undefined") {
    return null;
  }

  const rawSession = window.sessionStorage.getItem(ADMIN_SESSION_KEY);

  if (!rawSession) {
    return null;
  }

  try {
    const parsed = JSON.parse(rawSession) as StoredAdminSession;

    if (!parsed.authenticated) {
      return null;
    }

    return parsed;
  } catch {
    return null;
  }
}

export function authenticateAdmin(username: string, password: string) {
  const normalizedUsername = username.trim();

  if (
    normalizedUsername !== getConfiguredAdminUsername() ||
    password !== getConfiguredAdminPassword()
  ) {
    return false;
  }

  if (typeof window !== "undefined") {
    window.sessionStorage.setItem(
      ADMIN_SESSION_KEY,
      JSON.stringify({
        authenticated: true,
        username: normalizedUsername,
      } satisfies StoredAdminSession),
    );
  }

  return true;
}

export function clearAdminSession() {
  if (typeof window !== "undefined") {
    window.sessionStorage.removeItem(ADMIN_SESSION_KEY);
  }
}

export function getAdminCredentialHint() {
  return {
    username: getConfiguredAdminUsername(),
    isUsingDefaultPassword:
      getConfiguredAdminPassword() === DEFAULT_ADMIN_PASSWORD,
  };
}
