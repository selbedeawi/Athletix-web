import { Component, inject, signal, viewChild, ViewChild } from '@angular/core';
import { TranslationTemplates } from '../../shared/enums/translation-templates-enum';
import { APP_ROUTES } from '../../core/enums/pages-urls-enum';
import { MatDivider } from '@angular/material/divider';
import { MatCard, MatCardContent } from '@angular/material/card';
import { TranslocoDirective } from '@jsverse/transloco';
import { MatButtonModule } from '@angular/material/button';
import { MatPaginator } from '@angular/material/paginator';
import { EmptyResultComponent } from '../../shared/ui-components/templates/empty-result/empty-result.component';
import { PtSessionsFillterComponent } from './components/pt-sessions-fillter/pt-sessions-fillter.component';
import { BookSessionDialogComponent } from './components/book-session-dialog/book-session-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { PrivateSessionsBookingService } from './services/pt-sessions.service';
import { TimeFormatPipe } from '../booked-sessions/time-format.pipe';
import { finalize } from 'rxjs';

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
    PtSessionsFillterComponent,
    TimeFormatPipe,
  ],
  templateUrl: './pt-sessions.component.html',
  styleUrl: './pt-sessions.component.scss',
})
export class PtSessionsComponent {
  private dialog = inject(MatDialog);
  private PrivateSessionsBookingService = inject(PrivateSessionsBookingService);
  translationTemplate = TranslationTemplates.PT_SESSION;
  APP_ROUTES = APP_ROUTES;
  ptSessionsFilter=viewChild(PtSessionsFillterComponent) ; 
  BookedSessionData = 'sss';
  loading = signal(false);
  constructor() {}
  openBookSessionDialog(): void {
    const dialogRef = this.dialog.open(BookSessionDialogComponent, {
      width: '600px',
      data: this.BookedSessionData,
    });

    dialogRef.afterClosed().subscribe((result) => {
      console.log('Dialog was closed', result);
    });
  }

  deleteSession(bookingId: number) {
    this.loading.set(true);
      this.PrivateSessionsBookingService.deletePrivateSessionBooking(bookingId)
      .pipe(finalize(() => this.loading.set(false)))
      .subscribe(
        (res) => {
          this.ptSessionsFilter()?.ptSessions().forEach((session, index) => {
            if (session.private_booking_id === bookingId) {
              this.ptSessionsFilter()?.getAll(); 
            }
          });
        },

      );
  }
  
}
