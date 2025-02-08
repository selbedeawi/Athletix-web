import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, throwError } from 'rxjs';
import { SnackbarService } from '../../services/snackbar/snackbar.service';
import { AuthService } from '../../services/auth/auth.service';

export const httpErrorInterceptor: HttpInterceptorFn = (req, next) => {
  const snackBar = inject(SnackbarService);
  const authService = inject(AuthService);

  return next(req).pipe(
    catchError((err) => {
      if (err.status === 500 || err.status === 0) {
        snackBar.error('ERROR_OCCURED');
      }

      const response: any = err.error;
      if (response && response.errors) {
        const error: any = [];
        response.errors.forEach((e: any) => {
          if (e.errorCode) {
            error.push(e.errorCode);
            if (Array.isArray(e.extra)) {
              error.push(':');
              error.push(e.extra[0]?.description);
            } else if (e.extra?.message) {
              error.push(e.extra?.message);
            } else if (e.extra?.errorCode) {
              error.push(e.extra?.errorCode);
            } else if (e.extra?.accessFailedCount) {
              error.push(e.extra?.accessFailedCount);
            }
          }
        });
        if (error[0] === 'ProgramNoRemainingSpaces') {
          snackBar.error(error[0]);
        } else {
          snackBar.error(error.join('   '));
        }
        return throwError(() => err);
      }
      if (err.status === 401) {
        authService.logout();
        return throwError(() => err);
      }
      return throwError(() => err);
    })
  );
};
