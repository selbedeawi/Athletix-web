import { HttpInterceptorFn } from '@angular/common/http';
import { catchError, Observable, throwError } from 'rxjs';

declare var apiUrl: string;
export const httpRequestInterceptor: HttpInterceptorFn = (req, next) => {
  if (req.url.includes('api/')) {
    const authReq = req.clone({
      url: apiUrl + req.url,
    });
    return next(authReq);
  } else {
    return next(req);
  }
};
