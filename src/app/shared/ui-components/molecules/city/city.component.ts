import {
  ChangeDetectionStrategy,
  Component,
  inject,
  input,
  model,
} from '@angular/core';
import { SelectComponent } from '../../atoms/select/select.component';
import { toObservable } from '@angular/core/rxjs-interop';
import { AsyncPipe } from '@angular/common';
import { TranslocoDirective } from '@jsverse/transloco';
import { LookupService } from '../../../../core/services/lookup/lookup.service';
import { LookupKeys } from '../../../enums/Lookup-Keys-enum';
import { TranslationTemplates } from '../../../enums/translation-templates-enum';
import { map, switchMap } from 'rxjs';

@Component({
  selector: 'app-city',
  imports: [SelectComponent, AsyncPipe, TranslocoDirective],
  templateUrl: './city.component.html',
  styleUrl: './city.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CityComponent {
  translationTemplate = input<TranslationTemplates>(TranslationTemplates.GLOB);
  lookupService = inject(LookupService);
  city = model.required<number>();
  isRequired = input(true);
  isDisabled = input(false);
  regionId = input<number>();

  $city = toObservable(this.regionId).pipe(
    switchMap((regionId) => {
      return this.lookupService.getOptions(LookupKeys.CITIES).pipe(
        map((cities) => {
          return cities.filter((city) =>
            regionId && city.regionId !== regionId ? false : true
          );
        })
      );
    })
  );
}
