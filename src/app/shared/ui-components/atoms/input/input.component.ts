import {
  ChangeDetectionStrategy,
  Component,
  input,
  model,
  viewChild,
} from "@angular/core";
import { MatInputModule } from "@angular/material/input";
import { MatFormFieldModule } from "@angular/material/form-field";
import {
  ControlContainer,
  FormsModule,
  NgForm,
  NgModel,
  Validators,
} from "@angular/forms";
import { BridgesInputType } from "./enum/bridges-input-type.enum";
import { NgxMaskDirective, provideNgxMask } from "ngx-mask";
import { TranslationTemplates } from "../../../enums/translation-templates-enum";
import { TranslocoDirective } from "@jsverse/transloco";

@Component({
  selector: "brdgs-input",
  standalone: true,
  imports: [
    MatFormFieldModule,
    MatInputModule,
    FormsModule,
    NgxMaskDirective,
    TranslocoDirective,
  ],
  templateUrl: "./input.component.html",
  styleUrls: ["./input.component.scss"],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [provideNgxMask()],
  viewProviders: [{ provide: ControlContainer, useExisting: NgForm }],
})
export class InputComponent {
  rondom = Math.random();
  public ngModel = viewChild.required<NgModel>("valueInput");
  translationTemplate = input<TranslationTemplates>(TranslationTemplates.GLOB);
  // Input properties
  public isRequired = input.required<boolean>();
  public label = input.required<string>();
  public type = input.required<BridgesInputType>();
  public isDisabled = input<boolean>(false);
  public placeholder = input<string>();
  public prefix = input<string>();
  public suffix = input<string>();
  public mask = input<string>("");
  public value = model<string | number | null>();

  public allowValidation = input(true);

  private patterns: Record<BridgesInputType, RegExp | string> = {
    [BridgesInputType.TEXT]: null as any,
    [BridgesInputType.NUMBER]: /^[0-9]*$/,
    [BridgesInputType.EMAIL]:
      /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
    [BridgesInputType.TEL]: /^\+?[1-9]{1}[0-9]{9}$/,
    [BridgesInputType.PASSWORD]: null as any,
    [BridgesInputType.POSTALCODE]: /[0-9a-zA-z]{6}/,
  };

  ngAfterViewInit() {
    const currentType = this.type();
    if (this.allowValidation()) {
      const validationArray = [Validators.pattern(this.patterns[currentType])];
      if (this.isRequired()) {
        validationArray.push(Validators.required);
      }
      this.ngModel()?.control.setValidators(validationArray);
    }
  }
}
