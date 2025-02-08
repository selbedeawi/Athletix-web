import {
  ChangeDetectionStrategy,
  Component,
  model,
  input,
} from '@angular/core';
import { CityComponent } from '../../molecules/city/city.component';
import { ProvinceComponent } from '../../molecules/province/province.component';
import { RegionComponent } from '../../molecules/region/region.component';
import { InputComponent } from '../../atoms/input/input.component';
import { BridgesInputType } from '../../atoms/input/enum/bridges-input-type.enum';
import { TranslocoDirective } from '@jsverse/transloco';
import { TranslationTemplates } from '../../../enums/translation-templates-enum';
import { Address } from './models/address-model';

@Component({
  selector: 'app-address',
  imports: [
    CityComponent,
    ProvinceComponent,
    RegionComponent,
    InputComponent,
    TranslocoDirective,
  ],
  templateUrl: './address.component.html',
  styleUrl: './address.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AddressComponent {
  translationTemplate = input<TranslationTemplates>(TranslationTemplates.GLOB);
  address = model.required<Address>();
  bridgesInputType = BridgesInputType;
  allowMainIntersection = input(false);
  isDisabled = input(false);
  toUpper() {
    this.address().postalCode = this.address().postalCode.toUpperCase();
  }
  regionChange() {
    this.address().cityId = null as any;
  }
}
