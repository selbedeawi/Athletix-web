import {
  ChangeDetectionStrategy,
  Component,
  inject,
  input,
} from "@angular/core";
import { MatButtonModule } from "@angular/material/button";
import { MatCardModule } from "@angular/material/card";
import { TranslocoDirective } from "@jsverse/transloco";
import { TranslationTemplates } from "../../../shared/enums/translation-templates-enum";

import { SnackbarService } from "../../../core/services/snackbar/snackbar.service";

@Component({
  selector: "app-member-pass-confirm",
  imports: [MatButtonModule, MatCardModule, TranslocoDirective],
  templateUrl: "./member-pass-confirm.component.html",
  styleUrl: "./member-pass-confirm.component.scss",
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MemberPassConfirmComponent {
  translationTemplate = TranslationTemplates.AUTH;

  snackBarService = inject(SnackbarService);
  email = input.required<string>();
  resend() {
    // this.authService
    //   .sendVerifyEmail(decodeURIComponent(this.email()))
    //   .subscribe(() => {
    //     this.snackBarService.success('SEND_VERIFY_EMAIL_SUCCESS');
    //   });
  }
}
