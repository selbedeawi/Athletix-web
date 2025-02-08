import {
  ChangeDetectionStrategy,
  Component,
  input,
  model,
} from '@angular/core';

import { SelectComponent } from '../../atoms/select/select.component';
import { TranslocoDirective } from '@jsverse/transloco';
import { RelationsToAccountHolder } from '../../../enums/account-holder-relations-enum';
import { TranslationTemplates } from '../../../enums/translation-templates-enum';
import { InputComponent } from '../../atoms/input/input.component';
import { FamilyMemberAccount } from '../../../models/family-member-account-model';
import { BridgesInputType } from '../../atoms/input/enum/bridges-input-type.enum';
import { NgClass } from '@angular/common';

@Component({
  selector: 'app-relation-to-account-holder',
  imports: [SelectComponent, TranslocoDirective, InputComponent, NgClass],
  templateUrl: './relation-to-account-holder.component.html',
  styleUrl: './relation-to-account-holder.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RelationToAccountHolderComponent {
  translationTemplate = input<TranslationTemplates>(TranslationTemplates.GLOB);
  account = model.required<FamilyMemberAccount>();
  isRequired = input(true);
  relationsToAccount = RelationsToAccountHolder;
  bridgesInputType = BridgesInputType;
  relationsToAccountHolderOptions = Object.entries(
    RelationsToAccountHolder
  ).map(([key, value]) => ({
    key,
    value,
  }));
}
