import { Component, inject } from '@angular/core';
import {
  MatDialogRef,
  MAT_DIALOG_DATA,
  MatDialogModule,
} from '@angular/material/dialog';
import { SnackbarService } from '../../../../core/services/snackbar/snackbar.service';
import { StaffService } from '../../../../features/staff-list/services/staff.service';
import { TranslationTemplates } from '../../../enums/translation-templates-enum';
import { BridgesInputType } from '../../atoms/input/enum/bridges-input-type.enum';
import { LoginCredentials } from '../../../../features/auth/login/login.component';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { TranslocoDirective } from '@jsverse/transloco';
import { ConfirmPasswordComponent } from '../../organisms/confirm-password/confirm-password.component';

@Component({
  selector: 'app-change-password-dialog',
  imports: [
    MatDialogModule,
    MatButtonModule,
    TranslocoDirective,
    FormsModule,
    ConfirmPasswordComponent,
  ],
  templateUrl: './change-password-dialog.component.html',
  styleUrl: './change-password-dialog.component.scss',
})
export class ChangePasswordDialogComponent {
  translationTemplate = TranslationTemplates.STAFF;

  readonly snackbar = inject(SnackbarService);
  readonly staffService = inject(StaffService);
  readonly dialogRef = inject(MatDialogRef<ChangePasswordDialogComponent>);
  readonly data = inject<{ userId: string }>(MAT_DIALOG_DATA);

  bridgesInputType = BridgesInputType;
  account = new LoginCredentials();
  constructor() {}

  onUpdate(): void {
    const newPassword = this.account.password;
    this.staffService.updatePassword(this.data.userId, newPassword).subscribe({
      next: (res) => {
        if (res.error) {
          this.snackbar.error('CHANGE_PASSWORD_ERROR');
        } else this.dialogRef.close({ success: true });
      },
      error: (err) => this.snackbar.error(err.error?.message || err.message),
    });
  }
}
