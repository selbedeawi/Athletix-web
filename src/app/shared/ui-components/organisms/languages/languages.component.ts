import {
  ChangeDetectionStrategy,
  Component,
  inject,
  input,
  model,
  OnInit,
  signal,
  effect,
} from '@angular/core';

import { SelectComponent } from '../../atoms/select/select.component';
import { BridgesInputType } from '../../atoms/input/enum/bridges-input-type.enum';
import { InputComponent } from '../../atoms/input/input.component';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatIcon } from '@angular/material/icon';
import { AsyncPipe } from '@angular/common';
import { TranslocoDirective } from '@jsverse/transloco';
import { MatButtonModule } from '@angular/material/button';
import { LookupService } from '../../../../core/services/lookup/lookup.service';
import { LookupKeys } from '../../../enums/Lookup-Keys-enum';
import { TranslationTemplates } from '../../../enums/translation-templates-enum';
import { AccountLanguages } from './models/language-model';
declare var FixedID: number;
@Component({
  selector: 'app-languages',
  imports: [
    SelectComponent,
    InputComponent,
    MatTooltipModule,
    MatIcon,
    AsyncPipe,
    TranslocoDirective,
    MatButtonModule,
  ],
  templateUrl: './languages.component.html',
  styleUrl: './languages.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LanguagesComponent implements OnInit {
  lookupService = inject(LookupService);
  translationTemplate = input<TranslationTemplates>(TranslationTemplates.GLOB);
  accountLanguages = model.required<AccountLanguages>();
  otherLanguagesSignal = signal<string[]>([]);
  readonly = input(false);
  bridgesInputType = BridgesInputType;
  fixedID = FixedID;

  constructor() {
    effect(() => {
      let accountLanguages = this.accountLanguages();
      if (accountLanguages) {
        this.otherLanguagesSignal.set(
          accountLanguages.otherLanguages.split(',')
        );
      }
    });
  }
  $languages = this.lookupService.getOptions(LookupKeys.LANGUAGES);
  ngOnInit(): void {}
  deleteLanguage(index: number) {
    this.otherLanguagesSignal.update((language) => {
      language.splice(index, 1);
      return [...language];
    });
  }
  updateOther() {
    this.accountLanguages().otherLanguages =
      this.otherLanguagesSignal().join(',');
  }
  addLanguage() {
    this.otherLanguagesSignal.update((language) => {
      language.push('');
      return [...language];
    });
  }
}
