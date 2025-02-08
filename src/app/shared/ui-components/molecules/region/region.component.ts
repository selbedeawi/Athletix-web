import { AsyncPipe } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  inject,
  input,
  model,
} from '@angular/core';
import { TranslocoDirective } from '@jsverse/transloco';

import { SelectComponent } from '../../atoms/select/select.component';
import { LookupService } from '../../../../core/services/lookup/lookup.service';
import { LookupKeys } from '../../../enums/Lookup-Keys-enum';
import { TranslationTemplates } from '../../../enums/translation-templates-enum';

@Component({
  selector: 'app-region',
  imports: [SelectComponent, AsyncPipe, TranslocoDirective],
  templateUrl: './region.component.html',
  styleUrl: './region.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RegionComponent {
  translationTemplate = input.required<TranslationTemplates>();
  lookupService = inject(LookupService);
  region = model.required<number>();
  isRequired = input(true);
  isDisabled = input(false);
  $region = this.lookupService.getOptions(LookupKeys.REGIONS);
}
