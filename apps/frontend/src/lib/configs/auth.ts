import { differenceInMilliseconds } from 'date-fns';
import Cookie from 'js-cookie';
import { jwtDecode } from 'jwt-decode';

const TOKEN_KEY = 'posnepal.accessToken';
const AUTH_KIND_KEY = 'posnepal.authKind';

export const auth = {
  login: (accessToken: string, kind?: 'admin' | 'user') => {
    try {
      const { exp } = jwtDecode<{ exp: number }>(accessToken);
      const expInDay =
        differenceInMilliseconds(new Date(exp * 1000), new Date()) /
        (1000 * 60 * 60 * 24);

      Cookie.set('accessToken', accessToken, {
        expires: Math.max(expInDay, 1 / 24),
        path: '/',
        secure: process.env.NODE_ENV === 'production',
      });
      if (typeof window !== 'undefined') {
        window.localStorage.setItem(TOKEN_KEY, accessToken);
      }
      if (kind) {
        Cookie.set('authKind', kind, {
          expires: Math.max(expInDay, 1 / 24),
          path: '/',
          secure: process.env.NODE_ENV === 'production',
        });
        if (typeof window !== 'undefined') {
          window.localStorage.setItem(AUTH_KIND_KEY, kind);
        }
      }
    } catch {
      Cookie.set('accessToken', accessToken, { path: '/' });
      if (typeof window !== 'undefined') {
        window.localStorage.setItem(TOKEN_KEY, accessToken);
      }
    }
  },
  logout: () => {
    Cookie.remove('accessToken', { path: '/' });
    Cookie.remove('authKind', { path: '/' });
    Cookie.remove('refresh-token', { path: '/' });
    if (typeof window !== 'undefined') {
      window.localStorage.removeItem(TOKEN_KEY);
      window.localStorage.removeItem(AUTH_KIND_KEY);
    }
  },
};
