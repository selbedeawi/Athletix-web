import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatInputModule } from '@angular/material/input';
import { InputComponent } from '../../../shared/ui-components/atoms/input/input.component';
import { BridgesInputType } from '../../../shared/ui-components/atoms/input/enum/bridges-input-type.enum';
import { MatIconModule } from '@angular/material/icon';
import { AuthService } from '../../../core/services/auth/auth.service';
import { SnackbarService } from '../../../core/services/snackbar/snackbar.service';
import { APP_ROUTES } from '../../../core/enums/pages-urls-enum';
import { RouterLink } from '@angular/router';
import { TranslocoDirective } from '@jsverse/transloco';
import { TranslationTemplates } from '../../../shared/enums/translation-templates-enum';

@Component({
  selector: 'app-reset-password',
  imports: [
    MatButtonModule,
    MatInputModule,
    MatCardModule,
    ReactiveFormsModule,
    InputComponent,
    FormsModule,
    MatIconModule,
    RouterLink,
    TranslocoDirective,
  ],
  templateUrl: './reset-password.component.html',
  styleUrl: './reset-password.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ResetPasswordComponent {
  email!: string;
  bridgesInputType = BridgesInputType;
  authService = inject(AuthService);
  snackBarService = inject(SnackbarService);
  APP_ROUTES = APP_ROUTES;
  translationTemplate = TranslationTemplates.AUTH;

  resetPassword() {
    this.authService.forgetPassword(this.email).subscribe({
      next: () => {
        this.snackBarService.success('RESET_PASSWORD_EMAIL_SENT');
      },
      error: () => {
        this.snackBarService.error('RESET_PASSWORD_EMAIL_ERROR');
      },
    });
  }
}
