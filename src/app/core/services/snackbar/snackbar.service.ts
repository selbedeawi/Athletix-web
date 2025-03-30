import { TranslocoService } from "@jsverse/transloco";
import {
  MatSnackBar,
  MatSnackBarHorizontalPosition,
  MatSnackBarVerticalPosition,
} from "@angular/material/snack-bar";

import { Injectable } from "@angular/core";
import { TranslationTemplates } from "../../../shared/enums/translation-templates-enum";

@Injectable({ providedIn: "root" })
export class SnackbarService {
  horizontalPosition: MatSnackBarHorizontalPosition = "center";
  verticalPosition: MatSnackBarVerticalPosition = "top";

  constructor(
    private TranslocoService: TranslocoService,
    private matSnackBar: MatSnackBar,
  ) {}

  success(message: string, duration = 10000) {
    this.matSnackBar.open(
      this.TranslocoService.translate(
        `${TranslationTemplates.GLOB}.${message}`,
      ),
      "X",
      {
        duration: duration,
        horizontalPosition: this.horizontalPosition,
        verticalPosition: this.verticalPosition,
        panelClass: "success-snackbar",
        politeness: "assertive",
      },
    );
  }

  error(message: string, duration = 10000) {
    this.matSnackBar.open(
      this.TranslocoService.translate(
        `${TranslationTemplates.GLOB}.${message}`,
      ),
      "X",
      {
        duration: duration,
        horizontalPosition: this.horizontalPosition,
        verticalPosition: this.verticalPosition,
        panelClass: "error-snackbar",
        politeness: "assertive",
      },
    );
  }
}
