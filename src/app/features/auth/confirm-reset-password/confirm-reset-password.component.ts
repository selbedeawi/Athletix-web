import {
  ChangeDetectionStrategy,
  Component,
  inject,
  model,
  OnDestroy,
  OnInit,
} from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";

import { ConfirmPasswordComponent } from "../../../shared/ui-components/organisms/confirm-password/confirm-password.component";
import { FormsModule } from "@angular/forms";
import { MatCardModule } from "@angular/material/card";
import { InputComponent } from "../../../shared/ui-components/atoms/input/input.component";
import { BridgesInputType } from "../../../shared/ui-components/atoms/input/enum/bridges-input-type.enum";
import { MatButtonModule } from "@angular/material/button";

import { TranslationTemplates } from "../../../shared/enums/translation-templates-enum";
import { TranslocoDirective } from "@jsverse/transloco";
import { LoginCredentials } from "../login/login.component";
import { SupabaseService } from "../../../core/services/supabase/supabase.service";
import { SnackbarService } from "../../../core/services/snackbar/snackbar.service";
import { UserService } from "../../../core/services/user/user.service";
import { APP_ROUTES } from "../../../core/enums/pages-urls-enum";
import { AsyncPipe } from "@angular/common";

@Component({
  selector: "app-confirm-reset-password",
  imports: [
    ConfirmPasswordComponent,
    FormsModule,
    MatCardModule,
    InputComponent,
    MatButtonModule,
    TranslocoDirective,
    AsyncPipe,
  ],
  templateUrl: "./confirm-reset-password.component.html",
  styleUrl: "./confirm-reset-password.component.scss",
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ConfirmResetPasswordComponent implements OnInit, OnDestroy {
  bridgesInputType = BridgesInputType;
  account = new LoginCredentials();
  translationTemplate = TranslationTemplates.AUTH;
  route = inject(ActivatedRoute);
  supabaseService = inject(SupabaseService);
  snackBarService = inject(SnackbarService);
  userService = inject(UserService);
  router = inject(Router);

  ngOnInit(): void {
    this.userService.currentUser$.subscribe((res) => {
      if (res?.email) {
        this.account.email = res?.email;
      }
    });
  }

  resetPassword() {
    this.supabaseService.confirmChangePassword(
      this.account.password,
    ).subscribe({
      next: () => {
        this.snackBarService.success("PASSWORD_RESET_SUCCESSFUL");
        if (this.userService.currentUser?.role === "Member") {
          this.userService.logout([
            "/",
            APP_ROUTES.AUTH,
            APP_ROUTES.RESEND_CONFIRM,
            this.userService.currentUser.email,
          ]);
        } else {
          setTimeout(() => {
            this.userService.logout();
          }, 1000);
        }
      },
      error: (error) => {
        console.error("Password reset failed", error);
        this.snackBarService.error("Password reset failed. Please try again.");
      },
    });
  }
  ngOnDestroy(): void {
    if (this.userService.currentUser?.id) {
      this.userService.logout();
    }
  }
}
