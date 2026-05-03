import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, throwError } from 'rxjs';
import { ToastService } from '../services/toast.service';

/** Surfaces API errors to an ARIA live region via ToastService */
export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  const toast = inject(ToastService);
  const isAuthForm = req.url.includes('/auth/login') || req.url.includes('/auth/register');
  return next(req).pipe(
    catchError((err: unknown) => {
      if (!isAuthForm) {
        if (err instanceof HttpErrorResponse) {
          const body = err.error as { error?: string } | null;
          const msg = body?.error ?? err.message ?? 'Request failed';
          toast.show(msg);
        } else if (err instanceof Error) {
          toast.show(err.message);
        } else {
          toast.show('Request failed');
        }
      }
      return throwError(() => err);
    }),
  );
};
