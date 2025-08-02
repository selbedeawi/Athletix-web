import { Component, Inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule
} from '@angular/forms';
import {
  MatDialogRef,
  MAT_DIALOG_DATA,
  MatDialogModule
} from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule }     from '@angular/material/input';
import { MatButtonModule }    from '@angular/material/button';
import { TranslocoDirective } from '@jsverse/transloco';
import { StaffService }       from '../../services/staff.service';
import { TranslationTemplates } from '../../../../shared/enums/translation-templates-enum';

export interface UpdateEmailDialogData {
  userId: string;
  email:  string;
}

@Component({
  selector: 'app-update-email-dialog',
  standalone: true,
  imports: [
     CommonModule, 
    ReactiveFormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    TranslocoDirective
  ],
  templateUrl: './change-email-dialog.html'
})
export class UpdateEmailDialogComponent implements OnInit {
  translationTemplate = TranslationTemplates.STAFF;
  form: FormGroup;

  constructor(
    private fb: FormBuilder,
    private staffService: StaffService,
    private dialogRef: MatDialogRef<UpdateEmailDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: UpdateEmailDialogData
  ) {
    this.form = this.fb.group({
      email: [data.email, [Validators.required, Validators.email]]
    });
  }

  ngOnInit(): void {}

  onCancel(): void {
    this.dialogRef.close();
  }

  onUpdate(): void {
    if (this.form.invalid) return;
    const newEmail = this.form.value.email.trim();
    this.staffService.updateEmail(this.data.userId, newEmail).subscribe({
      next: () => this.dialogRef.close({ success: true, email: newEmail }),
      error: err => this.form.setErrors({ server: err.error?.message || err.message })
    });
  }
}
