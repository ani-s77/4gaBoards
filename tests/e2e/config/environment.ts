const trimTrailingSlash = (value: string): string => value.replace(/\/+$/, '');

export const testEnvironment = {
  baseUrl: trimTrailingSlash(
    process.env.E2E_BASE_URL ?? process.env.PLAYWRIGHT_BASE_URL ?? 'http://localhost:3000',
  ),
  admin: {
    username: process.env.E2E_ADMIN_USERNAME ?? 'demo',
    password: process.env.E2E_ADMIN_PASSWORD ?? 'demo',
  },
};
