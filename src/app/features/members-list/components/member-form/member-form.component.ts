import { AsyncPipe } from "@angular/common";
import { Component, input, model } from "@angular/core";
import { ControlContainer, FormsModule, NgForm } from "@angular/forms";
import { MatButtonModule } from "@angular/material/button";
import { MatCardModule } from "@angular/material/card";
import { MatDivider } from "@angular/material/divider";
import { MatIcon } from "@angular/material/icon";
import { RouterLink } from "@angular/router";
import { TranslocoDirective } from "@jsverse/transloco";
import { DatePickerComponent } from "../../../../shared/ui-components/atoms/date-picker/date-picker.component";
import { InputComponent } from "../../../../shared/ui-components/atoms/input/input.component";
import { ConfirmPasswordComponent } from "../../../../shared/ui-components/organisms/confirm-password/confirm-password.component";
import { MemberAccount } from "../../models/member";
import { TranslationTemplates } from "../../../../shared/enums/translation-templates-enum";
import { BridgesInputType } from "../../../../shared/ui-components/atoms/input/enum/bridges-input-type.enum";

@Component({
  selector: "app-member-form",
  imports: [
    FormsModule,
    MatCardModule,
    InputComponent,
    TranslocoDirective,
    MatButtonModule,
    ConfirmPasswordComponent,
    DatePickerComponent,
  ],
  templateUrl: "./member-form.component.html",
  styleUrl: "./member-form.component.scss",
  viewProviders: [{ provide: ControlContainer, useExisting: NgForm }],
})
export class MemberFormComponent {
  member = model.required<MemberAccount>();
  translationTemplate = input.required<TranslationTemplates>();
  bridgesInputType = BridgesInputType;
}
