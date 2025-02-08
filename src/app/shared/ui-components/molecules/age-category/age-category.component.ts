import {
  ChangeDetectionStrategy,
  Component,
  inject,
  input,
  model,
} from '@angular/core';

import { SelectComponent } from '../../atoms/select/select.component';
import { TranslocoDirective } from '@jsverse/transloco';
import { TranslationTemplates } from '../../../enums/translation-templates-enum';
import { LookupService } from '../../../../core/services/lookup/lookup.service';
import { LookupKeys } from '../../../enums/Lookup-Keys-enum';
import { AsyncPipe } from '@angular/common';

@Component({
  selector: 'app-age-category',
  imports: [SelectComponent, TranslocoDirective, AsyncPipe],
  templateUrl: './age-category.component.html',
  styleUrl: './age-category.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AgeCategoryComponent {
  lookupService = inject(LookupService);
  translationTemplate = input<TranslationTemplates>(TranslationTemplates.GLOB);
  ageCategory = model.required<number>();
  isRequired = input(true);

  $ageCategoryOptions = this.lookupService.getOptions(
    LookupKeys.AGE_CATEGORIES
  );
}
