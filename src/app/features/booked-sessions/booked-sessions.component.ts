import { Component } from '@angular/core';
import { BookSessionsFillterComponent } from './components/book-sessions-fillter/book-sessions-fillter.component';
import { MatCard, MatCardContent } from '@angular/material/card';
import { MatDivider, MatDividerModule } from '@angular/material/divider';
import { TranslocoDirective } from '@jsverse/transloco';
import { MatButtonModule } from '@angular/material/button';
import { MatPaginator } from '@angular/material/paginator';
import { EmptyResultComponent } from '../../shared/ui-components/templates/empty-result/empty-result.component';
import { TranslationTemplates } from '../../shared/enums/translation-templates-enum';
import { APP_ROUTES } from '../../core/enums/pages-urls-enum';
import { TimeFormatPipe } from './time-format.pipe';

@Component({
  selector: 'app-booked-sessions',
  imports: [
    BookSessionsFillterComponent,
    MatDividerModule,
    MatDivider,
    MatCard,
    MatCardContent,
    TranslocoDirective,
    MatButtonModule,
    MatPaginator,
    EmptyResultComponent,
    TimeFormatPipe,
  ],
  templateUrl: './booked-sessions.component.html',
  styleUrl: './booked-sessions.component.scss',
})
export class BookedSessionsComponent {
  translationTemplate = TranslationTemplates.BOOKED_SESSION;
  APP_ROUTES = APP_ROUTES;
}
