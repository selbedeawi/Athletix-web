import { Component, ChangeDetectionStrategy, inject } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatCardModule } from '@angular/material/card';
import { InputComponent } from '../../../shared/ui-components/atoms/input/input.component';
import { BridgesInputType } from '../../../shared/ui-components/atoms/input/enum/bridges-input-type.enum';
import { AuthService } from '../../../core/services/auth/auth.service';
import { take } from 'rxjs';
import { BEResponse } from '../../../shared/models/shared-models';
import { ILoginRes, roleRouteMapping } from '../../../shared/models/auth.model';
import { APP_ROUTES } from '../../../core/enums/pages-urls-enum';
import { TranslationTemplates } from '../../../shared/enums/translation-templates-enum';
import { TranslocoDirective } from '@jsverse/transloco';
import { SnackbarService } from '../../../core/services/snackbar/snackbar.service';

export class LoginCredentials {
  email!: string;
  password!: string;
  confirmPassword?: string;
}

@Component({
  selector: 'app-login',
  imports: [
    MatButtonModule,
    MatInputModule,
    MatCardModule,
    ReactiveFormsModule,
    InputComponent,
    FormsModule,
    RouterLink,
    TranslocoDirective,
  ],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LoginComponent {
  bridgesInputType = BridgesInputType;
  form: LoginCredentials = {
    email: '',
    password: '',
  };
  authService = inject(AuthService);
  router = inject(Router);
  route = inject(ActivatedRoute);
  snackbarService = inject(SnackbarService);
  APP_ROUTES = APP_ROUTES;
  translationTemplate = TranslationTemplates.AUTH;
  verifyEmailToken: string = '';
  userId: string = '';

  ngOnInit(): void {
    this.verifyEmailToken = this.route.snapshot.paramMap.get('token') || '';
    this.userId = decodeURIComponent(
      this.route.snapshot.queryParamMap.get('userId') || ''
    );

    if (this.route.snapshot.paramMap.get('token') && this.userId) {
      this.authService
        .verifyEmail(this.verifyEmailToken, this.userId)
        .subscribe({
          next: (response: BEResponse<ILoginRes>) => {
            this.snackbarService.success('VERIFY_EMAIL_SUCCESS');
          },
          error: (error) => {
            console.log(error);
          },
        });
    }
  }

  login() {
    this.authService
      .login(this.form)
      .pipe(take(1))
      .subscribe({
        next: (response: BEResponse<ILoginRes>) => {
          const userRole = response?.data?.user?.role;
          const route = roleRouteMapping[userRole];
          if (route) {
            this.router.navigate([route]);
          } else {
            console.error('No route defined for this role:', userRole);
          }
        },
        error: (error: any) => {
          if (
            error.error?.errors?.[0]?.errorCode === 'USER_EMAIL_NOT_CONFIRMED'
          ) {
            this.router.navigate([
              '/',
              APP_ROUTES.AUTH,
              APP_ROUTES.RESEND_CONFIRM,
              encodeURIComponent(this.form.email),
            ]);
          }
        },
      });
  }
}
