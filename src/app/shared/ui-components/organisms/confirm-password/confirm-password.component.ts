import {
  ChangeDetectionStrategy,
  Component,
  input,
  model,
  signal,
  viewChild,
} from "@angular/core";

import { InputWithValidationComponent } from "../../molecules/input-with-validation/input-with-validation";
import { TranslocoDirective } from "@jsverse/transloco";
import { TranslationTemplates } from "../../../enums/translation-templates-enum";
import { InputComponent } from "../../atoms/input/input.component";

import { ControlContainer, FormsModule, NgForm, NgModel } from "@angular/forms";
import { MatIconButton } from "@angular/material/button";
import { MatIcon } from "@angular/material/icon";
import { MatInputModule } from "@angular/material/input";
import { LoginCredentials } from "../../../../features/auth/login/login.component";
import { BridgesInputType } from "../../atoms/input/enum/bridges-input-type.enum";

@Component({
  selector: "app-confirm-password",
  imports: [
    InputWithValidationComponent,
    TranslocoDirective,
    MatIcon,
    MatIconButton,
    FormsModule,
    MatInputModule,
  ],
  templateUrl: "./confirm-password.component.html",
  styleUrl: "./confirm-password.component.scss",
  changeDetection: ChangeDetectionStrategy.OnPush,
  viewProviders: [{ provide: ControlContainer, useExisting: NgForm }],
})
export class ConfirmPasswordComponent {
  translationTemplate = input<TranslationTemplates>(TranslationTemplates.GLOB);
  account = model.required<LoginCredentials>();
  bridgesInputType = BridgesInputType;

  inputType = signal<string>("password");
  errorMessage = "";

  inputTag = viewChild<NgModel>("inputTag");
  inputValidatorChange() {
    if (
      !this.account().confirmPassword ||
      this.account().confirmPassword === ""
    ) {
      this.errorMessage = "REQUIRED";
    } else if (this.account().confirmPassword !== this.account().password) {
      this.inputTag()?.control.setErrors({ match: true });
      this.errorMessage = "PASSWORD_DOES_NOT_MATCH";
    } else if (this.account()?.confirmPassword === this.account().password) {
      this.inputTag()?.control.setErrors(null);
      this.errorMessage = "";
    }
  }
}
