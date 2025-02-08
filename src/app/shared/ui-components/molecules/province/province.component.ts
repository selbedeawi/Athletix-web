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
  selector: 'app-province',
  imports: [SelectComponent, AsyncPipe, TranslocoDirective],
  templateUrl: './province.component.html',
  styleUrl: './province.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProvinceComponent {
  translationTemplate = input.required<TranslationTemplates>();
  lookupService = inject(LookupService);
  province = model.required<number>();
  isRequired = input(true);
  isDisabled = input(false);
  $province = this.lookupService.getOptions(LookupKeys.PROVINCES);
}
