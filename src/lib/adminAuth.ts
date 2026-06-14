type AdminAuthEnv = {
  ADMIN_USER?: string;
  ADMIN_PASSWORD?: string;
};

const BASIC_AUTH_SCHEME = "basic";

export function isValidAdminAuth(
  authorization: string | null,
  env: AdminAuthEnv = {
    ADMIN_USER: process.env.ADMIN_USER,
    ADMIN_PASSWORD: process.env.ADMIN_PASSWORD,
  },
) {
  const expectedUser = env.ADMIN_USER;
  const expectedPassword = env.ADMIN_PASSWORD;

  if (!expectedUser || !expectedPassword) {
    return false;
  }

  const [scheme, encoded] = authorization?.split(/\s+/, 2) ?? [];

  if (scheme?.toLowerCase() !== BASIC_AUTH_SCHEME || !encoded) {
    return false;
  }

  try {
    const decoded = atob(encoded);
    const separatorIndex = decoded.indexOf(":");

    if (separatorIndex === -1) {
      return false;
    }

    const user = decoded.slice(0, separatorIndex);
    const password = decoded.slice(separatorIndex + 1);

    return user === expectedUser && password === expectedPassword;
  } catch {
    return false;
  }
}
