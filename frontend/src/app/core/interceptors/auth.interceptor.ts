import { HttpInterceptorFn } from '@angular/common/http';
import { readStoredToken } from '../auth-storage';

/** Attaches Bearer token for API calls (reads session storage to avoid DI cycles) */
export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const token = readStoredToken();
  if (!token || req.url.includes('/auth/login') || req.url.includes('/auth/register')) {
    return next(req);
  }
  return next(req.clone({ setHeaders: { Authorization: `Bearer ${token}` } }));
};
