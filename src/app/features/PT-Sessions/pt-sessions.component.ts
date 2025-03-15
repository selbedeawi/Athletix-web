import { Component, inject } from '@angular/core';
import { TranslationTemplates } from '../../shared/enums/translation-templates-enum';
import { APP_ROUTES } from '../../core/enums/pages-urls-enum';
import { MatDivider } from '@angular/material/divider';
import { MatCard, MatCardContent } from '@angular/material/card';
import { TranslocoDirective } from '@jsverse/transloco';
import { MatButtonModule } from '@angular/material/button';
import { MatPaginator } from '@angular/material/paginator';
import { EmptyResultComponent } from '../../shared/ui-components/templates/empty-result/empty-result.component';
import {  PtSessionsFillterComponent } from "./components/pt-sessions-fillter/pt-sessions-fillter.component";
import { BookSessionDialogComponent } from './components/book-session-dialog/book-session-dialog.component';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-pt-sessions',
  imports: [
    MatDivider,
    MatCard,
    MatCardContent,
    TranslocoDirective,
    MatButtonModule,
    MatPaginator,
    EmptyResultComponent,
    PtSessionsFillterComponent
],
  templateUrl: './pt-sessions.component.html',
  styleUrl: './pt-sessions.component.scss',
})
export class PtSessionsComponent {
  private dialog=inject (MatDialog)

  translationTemplate = TranslationTemplates.PT_SESSION;
  APP_ROUTES = APP_ROUTES;

  BookedSessionData="sss"
  openBookSessionDialog(): void {
    const dialogRef = this.dialog.open(BookSessionDialogComponent, {
      width: '600px',
      data: this.BookedSessionData
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('Dialog was closed', result); 
    });
  }
}
