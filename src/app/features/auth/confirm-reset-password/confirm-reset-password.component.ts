import {
  ChangeDetectionStrategy,
  Component,
  inject,
  model,
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

@Component({
  selector: "app-confirm-reset-password",
  imports: [
    ConfirmPasswordComponent,
    FormsModule,
    MatCardModule,
    InputComponent,
    MatButtonModule,
    TranslocoDirective,
  ],
  templateUrl: "./confirm-reset-password.component.html",
  styleUrl: "./confirm-reset-password.component.scss",
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ConfirmResetPasswordComponent implements OnInit {
  passwordToken: string = "";
  bridgesInputType = BridgesInputType;
  account = new LoginCredentials();
  translationTemplate = TranslationTemplates.AUTH;
  route = inject(ActivatedRoute);

  router = inject(Router);

  ngOnInit(): void {
    this.passwordToken = this.route.snapshot.paramMap.get("passwordToken") ||
      "";
    this.account.email = decodeURIComponent(
      this.route.snapshot.queryParamMap.get("email") || "",
    );
  }

  resetPassword() {
    // this.authService
    //   .confirmChangePassword(
    //     this.passwordToken,
    //     this.account.password,
    //     this.account.email
    //   )
    //   .subscribe({
    //     next: () => {
    //       console.log('Password reset successful');
    //       this.router.navigate(['/login']);
    //     },
    //     error: (error) => {
    //       console.error('Password reset failed', error);
    //     },
    //   });
  }
}
