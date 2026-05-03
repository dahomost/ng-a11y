import { HttpInterceptorFn } from '@angular/common/http';
import { retry } from 'rxjs';

/** Retries idempotent reads on transient failures */
export const retryInterceptor: HttpInterceptorFn = (req, next) => {
  if (req.method !== 'GET') {
    return next(req);
  }
  return next(req).pipe(retry(2));
};
