import { TranslocoService } from '@jsverse/transloco';
import {
  MatSnackBar,
  MatSnackBarHorizontalPosition,
  MatSnackBarVerticalPosition,
} from '@angular/material/snack-bar';

import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class SnackbarService {
  horizontalPosition: MatSnackBarHorizontalPosition = 'center';
  verticalPosition: MatSnackBarVerticalPosition = 'top';
  constructor(
    private TranslocoService: TranslocoService,
    private matSnackBar: MatSnackBar
  ) {}

  success(message: string, duration = 10000) {
    this.TranslocoService.selectTranslate(message).subscribe((translation) => {
      this.matSnackBar.open(translation, 'X', {
        duration: duration,
        horizontalPosition: this.horizontalPosition,
        verticalPosition: this.verticalPosition,
        panelClass: 'success-snackbar',
        politeness: 'assertive',
      });
    });
  }

  error(message: string, duration = 10000) {
    this.TranslocoService.selectTranslate(message).subscribe((translation) => {
      this.matSnackBar.open(translation, 'X', {
        duration: duration,
        horizontalPosition: this.horizontalPosition,
        verticalPosition: this.verticalPosition,
        panelClass: 'error-snackbar',
        politeness: 'assertive',
      });
    });
  }
}
