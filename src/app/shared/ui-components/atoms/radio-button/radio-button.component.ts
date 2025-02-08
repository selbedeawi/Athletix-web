import {
  ChangeDetectionStrategy,
  Component,
  input,
  model,
} from '@angular/core';
import { ControlContainer, FormsModule, NgForm } from '@angular/forms';
import { MatRadioModule } from '@angular/material/radio';
import { TranslationTemplates } from '../../../enums/translation-templates-enum';
import { TranslocoDirective } from '@jsverse/transloco';

@Component({
  selector: 'brdgs-radio',
  imports: [MatRadioModule, FormsModule, TranslocoDirective],
  templateUrl: './radio-button.component.html',
  styleUrl: './radio-button.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  viewProviders: [{ provide: ControlContainer, useExisting: NgForm }],
})
export class RadioButtonComponent {
  id = `bridges-radio-button${Math.random()}`;
  label = input.required<string>();
  required = input<boolean>(false);
  value = model.required<boolean | string | number>();
  options =
    input.required<{ key: string; value: boolean | string | number }[]>();
  translateOptions = input<boolean>(false);
  translationTemplate = input<TranslationTemplates>(TranslationTemplates.GLOB);
}
