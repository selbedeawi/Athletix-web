import {
  ChangeDetectionStrategy,
  Component,
  input,
  signal,
  model,
  viewChild,
  inject,
} from '@angular/core';
import { ControlContainer, FormsModule, NgForm, NgModel } from '@angular/forms';

import { PasswordTemplate } from './validation.password.template';
import { MatInput, MatInputModule } from '@angular/material/input';

import { TranslocoDirective, TranslocoService } from '@jsverse/transloco';
import { MatProgressBarModule } from '@angular/material/progress-bar';

import { ValidateTemplatePipe } from './action.validate.input.pipe';
import { MatIcon } from '@angular/material/icon';
import { MatIconButton } from '@angular/material/button';
import { TranslationTemplates } from '../../../enums/translation-templates-enum';

@Component({
  selector: 'app-input-with-validation',
  imports: [
    MatInput,
    MatInputModule,
    FormsModule,
    TranslocoDirective,
    MatProgressBarModule,
    MatIcon,
    MatIconButton,
    ValidateTemplatePipe,
  ],
  templateUrl: './input-with-validation.html',
  styleUrls: ['./input-with-validation.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  viewProviders: [{ provide: ControlContainer, useExisting: NgForm }],
})
export class InputWithValidationComponent {
  translationTemplate = input<TranslationTemplates>(TranslationTemplates.GLOB);
  value = model.required<string>();
  lable = input.required<string>();
  required = input.required<boolean>();

  inputType = signal<string>('password');
  translocoService = inject(TranslocoService);

  inputTemplateValidator = PasswordTemplate.getInstance(this.translocoService);
  inputFormName = 'InputWithValidationPopupComponentFormName';

  matchInputElement = input<any>('new-password');

  inputTag = viewChild<NgModel>('inputTag');
  errorMessage = '';
  isAllProgressComplete = false;
  progress = 0;
  constructor() {}

  inputValidatorChange() {
    this.progressValue();
    if (!this.value()) {
      this.errorMessage = '';
    }
  }

  progressValue() {
    let curruntProgress = 0;
    this.progress = 0;
    this.inputTemplateValidator.forEach((action) => {
      if (action.validate(this.value())) {
        curruntProgress++;
      } else {
        this.errorMessage = action.text;
      }
    });

    if (
      this.inputTag()?.control &&
      this.inputTemplateValidator.length !== curruntProgress
    ) {
      this.inputTag()?.control.setErrors({ match: true });
    } else {
      if (this.inputTag()?.control?.errors) {
        delete (this.inputTag()?.control?.errors as any)['match'];
        if (!Object.keys(this.inputTag()?.control.errors as any).length) {
          this.inputTag()?.control.setErrors(null);
        }
      }
    }

    this.isAllProgressComplete =
      curruntProgress === this.inputTemplateValidator.length;

    if (this.required() && this.value() === '') {
      this.errorMessage = 'REQUIRED';
    }
    this.progress =
      (curruntProgress / this.inputTemplateValidator.length) * 100;
  }
}
