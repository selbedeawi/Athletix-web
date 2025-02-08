import {
  ChangeDetectionStrategy,
  Component,
  input,
  model,
} from '@angular/core';

import { InputComponent } from '../../atoms/input/input.component';
import { BridgesInputType } from '../../atoms/input/enums/bridges-input-type.enum';
import { TranslocoDirective } from '@jsverse/transloco';
import { TranslationTemplates } from '../../../enums/translation-templates-enum';
import { BridgesName } from './models/name-model';

@Component({
  selector: 'app-name',
  imports: [InputComponent, TranslocoDirective],
  templateUrl: './name.component.html',
  styleUrl: './name.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NameComponent {
  name = model.required<BridgesName>();
  translationTemplate = input<TranslationTemplates>(TranslationTemplates.GLOB);
  bridgesInputType = BridgesInputType;
}
