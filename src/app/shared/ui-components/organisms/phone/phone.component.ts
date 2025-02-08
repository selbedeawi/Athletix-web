import {
  ChangeDetectionStrategy,
  Component,
  input,
  model,
} from '@angular/core';

import { NgModel } from '@angular/forms';
import { InputComponent } from '../../atoms/input/input.component';
import { TranslocoDirective } from '@jsverse/transloco';
import { SelectComponent } from '../../atoms/select/select.component';
import { BridgesInputType } from '../../atoms/input/enum/bridges-input-type.enum';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatIcon } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { TranslationTemplates } from '../../../enums/translation-templates-enum';
import { Phone, PhoneTypes } from './models/phone-model';
@Component({
  selector: 'app-phone',
  imports: [
    InputComponent,
    TranslocoDirective,
    SelectComponent,
    MatTooltipModule,
    MatIcon,
    MatButtonModule,
  ],
  templateUrl: './phone.component.html',
  styleUrl: './phone.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PhoneComponent {
  translationTemplate = input<TranslationTemplates>(TranslationTemplates.GLOB);
  phones = model.required<Phone[]>();

  isDisabled = input<boolean | undefined>(false);
  required = input<boolean>();

  phoneTypes = PhoneTypes;
  keyValuePhoneTypes = Object.entries(PhoneTypes).map(([key, value]) => ({
    key,
    value,
  }));

  bridgesInputType = BridgesInputType;

  constructor() {}

  ngOnInit(): void {}

  addTelephone() {
    if (this.phones()?.length === 1) {
      this.phones().push(new Phone(PhoneTypes.mobilePhone));
    }
  }

  deleteTelephone() {
    if (this.phones()?.length === 1) {
      this.phones()[0].phoneType = null as any;
      this.phones()[0].number = null as any;
      this.phones()[0].extension = null as any;
    }
    if (this.phones()?.length === 2) {
      this.phones.update((v) => {
        v.pop();
        return v;
      });
    }
  }

  valuePhonechange(value: string, phoneComp: NgModel) {
    if (this.phones?.length === 2 && value?.length === 10) {
      if (this.phones()[0].number === this.phones()[1].number) {
        phoneComp.control.setErrors({ duplicate: true });
      }
    }
  }
}
