type AdminAuthEnv = {
  ADMIN_USER?: string;
  ADMIN_PASSWORD?: string;
};

const BASIC_AUTH_PREFIX = "Basic ";

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

  if (!authorization?.startsWith(BASIC_AUTH_PREFIX)) {
    return false;
  }

  try {
    const encoded = authorization.slice(BASIC_AUTH_PREFIX.length).trim();
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
