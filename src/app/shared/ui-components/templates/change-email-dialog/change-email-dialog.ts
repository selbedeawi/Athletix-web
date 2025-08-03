import { Component, inject } from '@angular/core';

import { FormsModule } from '@angular/forms';
import {
  MatDialogRef,
  MAT_DIALOG_DATA,
  MatDialogModule,
} from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { TranslocoDirective } from '@jsverse/transloco';
import { StaffService } from '../../../../features/staff-list/services/staff.service';
import { TranslationTemplates } from '../../../enums/translation-templates-enum';
import { InputComponent } from '../../atoms/input/input.component';
import { BridgesInputType } from '../../atoms/input/enum/bridges-input-type.enum';
import { SnackbarService } from '../../../../core/services/snackbar/snackbar.service';

export interface UpdateEmailDialogData {
  userId: string;
  email: string;
}

@Component({
  selector: 'app-update-email-dialog',
  standalone: true,
  imports: [
    MatDialogModule,
    MatButtonModule,
    TranslocoDirective,
    InputComponent,
    FormsModule,
  ],
  templateUrl: './change-email-dialog.html',
})
export class UpdateEmailDialogComponent {
  translationTemplate = TranslationTemplates.STAFF;

  readonly snackbar = inject(SnackbarService);
  readonly staffService = inject(StaffService);
  readonly dialogRef = inject(MatDialogRef<UpdateEmailDialogComponent>);
  readonly data = inject<UpdateEmailDialogData>(MAT_DIALOG_DATA);

  bridgesInputType = BridgesInputType;
  email = '';
  constructor() {
    this.email = this.data.email;
  }

  onUpdate(): void {
    const newEmail = this.email.trim();
    this.staffService.updateEmail(this.data.userId, newEmail).subscribe({
      next: () => this.dialogRef.close({ success: true, email: newEmail }),
      error: (err) => this.snackbar.error(err.error?.message || err.message),
    });
  }
}
