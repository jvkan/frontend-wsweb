import { HttpInterceptorFn } from '@angular/common/http';

export const httpLoggingInterceptor: HttpInterceptorFn = (req, next) => {
  return next(req);
};
