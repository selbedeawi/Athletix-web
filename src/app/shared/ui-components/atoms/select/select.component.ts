import {
  ChangeDetectionStrategy,
  Component,
  input,
  model,
  viewChild,
} from '@angular/core';
import { ControlContainer, FormsModule, NgForm, NgModel } from '@angular/forms';
import { DropdownOptionsModel } from './select.model';
import { MatOptionModule } from '@angular/material/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { TranslocoDirective } from '@jsverse/transloco';
import { TranslationTemplates } from '../../../enums/translation-templates-enum';

@Component({
  selector: 'brdgs-select',
  imports: [
    MatOptionModule,
    MatFormFieldModule,
    MatSelectModule,
    FormsModule,
    TranslocoDirective,
  ],
  templateUrl: './select.component.html',
  styleUrl: './select.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  viewProviders: [{ provide: ControlContainer, useExisting: NgForm }],
})
export class SelectComponent<T = unknown> {
  random = Math.random();
  public isRequired = input.required<boolean>();
  public label = input.required<string>();
  public options = input.required<DropdownOptionsModel<T>[] | null>();
  public isMultiple = input<boolean>();
  public isDisabled = input<boolean>(false);
  public placeholder = input<string>();
  public value = model<T>();
  public ngModel = viewChild.required<NgModel>('valueInput');

  translateOptions = input<boolean>(false);
  translationTemplate = input<TranslationTemplates>(TranslationTemplates.GLOB);
}
