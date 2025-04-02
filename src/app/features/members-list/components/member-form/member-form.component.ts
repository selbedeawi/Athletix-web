import { Component, input, model } from "@angular/core";
import { ControlContainer, FormsModule, NgForm } from "@angular/forms";
import { MatButtonModule } from "@angular/material/button";
import { MatCardModule } from "@angular/material/card";
import { TranslocoDirective } from "@jsverse/transloco";
import { DatePickerComponent } from "../../../../shared/ui-components/atoms/date-picker/date-picker.component";
import { InputComponent } from "../../../../shared/ui-components/atoms/input/input.component";

import { MemberAccount } from "../../models/member";
import { TranslationTemplates } from "../../../../shared/enums/translation-templates-enum";
import { BridgesInputType } from "../../../../shared/ui-components/atoms/input/enum/bridges-input-type.enum";
import { SelectComponent } from "../../../../shared/ui-components/atoms/select/select.component";

@Component({
  selector: "app-member-form",
  imports: [
    FormsModule,
    MatCardModule,
    InputComponent,
    TranslocoDirective,
    MatButtonModule,

    DatePickerComponent,
    SelectComponent,
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
