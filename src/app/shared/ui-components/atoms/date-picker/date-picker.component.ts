import {
  ChangeDetectionStrategy,
  Component,
  input,
  model,
  viewChild,
} from '@angular/core';
import {
  ControlContainer,
  FormsModule,
  NgForm,
  NgModel,
  Validators,
} from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { provideNativeDateAdapter } from '@angular/material/core';
import { JsonPipe } from '@angular/common';
import { TranslocoDirective } from '@jsverse/transloco';
import { TranslationTemplates } from '../../../enums/translation-templates-enum';

@Component({
  selector: 'brdgs-date-picker',
  imports: [
    MatFormFieldModule,
    MatDatepickerModule,
    MatInputModule,
    FormsModule,
    TranslocoDirective,
  ],
  templateUrl: './date-picker.component.html',
  styleUrl: './date-picker.component.scss',
  providers: [provideNativeDateAdapter()],
  changeDetection: ChangeDetectionStrategy.OnPush,
  viewProviders: [{ provide: ControlContainer, useExisting: NgForm }],
})
export class DatePickerComponent {
  rondom = Math.random();
  translationTemplate = input<TranslationTemplates>(TranslationTemplates.GLOB);

  public ngModel = viewChild.required<NgModel>('valueInput');
  // Input properties
  public isRequired = input.required<boolean>();
  public label = input.required<string>();

  public isDisabled = input<boolean>(false);
  public placeholder = input<string>();
  public value = model<Date | string | number | null>();

  ngAfterViewInit() {
    const validationArray = [];
    if (this.isRequired()) {
      validationArray.push(Validators.required);
    }
    this.ngModel()?.control.setValidators(validationArray);
  }
}
