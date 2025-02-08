import {
  ChangeDetectionStrategy,
  Component,
  inject,
  input,
} from '@angular/core';
import { MatButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { TranslocoService } from '@jsverse/transloco';

@Component({
  selector: 'app-change-lang',
  imports: [MatButton, MatMenuModule, MatIcon],
  templateUrl: './change-lang.component.html',
  styleUrl: './change-lang.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ChangeLangComponent {
  translocoService = inject(TranslocoService);
  currentLang = 'en';
  isMainlayout = input(false);
  switchLang(lang: string) {
    this.currentLang = lang;
    this.translocoService.setActiveLang(lang);
  }
}
