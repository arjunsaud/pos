/**
 * Desktop (Electron) detection.
 * Preload sets window.posnepalDesktop; the shell also opens ?client=desktop.
 */
export function isDesktopClient(): boolean {
  if (typeof window === 'undefined') return false;
  if (window.posnepalDesktop) return true;
  try {
    return new URLSearchParams(window.location.search).get('client') === 'desktop';
  } catch {
    return false;
  }
}

export const DESKTOP_LOGIN_ROLES = ['tenant-admin', 'staff'] as const;

export function isDesktopLoginRole(
  role: string,
): role is (typeof DESKTOP_LOGIN_ROLES)[number] {
  return (DESKTOP_LOGIN_ROLES as readonly string[]).includes(role);
}

declare global {
  interface Window {
    posnepalDesktop?: {
      getNetwork(): Promise<unknown>;
      onNetworkChange(callback: (snapshot: unknown) => void): () => void;
      getVersion(): Promise<string>;
    };
  }
}

export {};
