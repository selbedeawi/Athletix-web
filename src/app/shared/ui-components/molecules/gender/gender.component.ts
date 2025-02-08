import {
  ChangeDetectionStrategy,
  Component,
  inject,
  input,
  model,
} from '@angular/core';

import { AsyncPipe } from '@angular/common';
import { TranslocoDirective } from '@jsverse/transloco';
import { SelectComponent } from '../../atoms/select/select.component';
import { LookupService } from '../../../../core/services/lookup/lookup.service';
import { LookupKeys } from '../../../enums/Lookup-Keys-enum';
import { TranslationTemplates } from '../../../enums/translation-templates-enum';

@Component({
  selector: 'app-gender',
  imports: [SelectComponent, AsyncPipe, TranslocoDirective],
  templateUrl: './gender.component.html',
  styleUrl: './gender.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GenderComponent {
  translationTemplate = input<TranslationTemplates>(TranslationTemplates.GLOB);
  lookupService = inject(LookupService);
  gender = model.required<number>();
  isRequired = input(true);

  $genders = this.lookupService.getOptions(LookupKeys.GENDERS);
}
