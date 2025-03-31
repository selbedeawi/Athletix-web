import { Component, inject, viewChild } from "@angular/core";
import { BookSessionsFillterComponent } from "./components/book-sessions-fillter/book-sessions-fillter.component";
import { MatCard, MatCardContent } from "@angular/material/card";
import { MatDivider, MatDividerModule } from "@angular/material/divider";
import { TranslocoDirective } from "@jsverse/transloco";
import { MatButtonModule } from "@angular/material/button";
import { MatPaginator } from "@angular/material/paginator";
import { EmptyResultComponent } from "../../shared/ui-components/templates/empty-result/empty-result.component";
import { TranslationTemplates } from "../../shared/enums/translation-templates-enum";
import { APP_ROUTES } from "../../core/enums/pages-urls-enum";
import { TimeFormatPipe } from "./time-format.pipe";
import { BookedSessionsService } from "./services/booked-sessions.service";
import { MatDialog } from "@angular/material/dialog";
import { SnackbarService } from "../../core/services/snackbar/snackbar.service";
import { ConfirmDeleteComponent } from "../../shared/ui-components/templates/confirm-delete/confirm-delete.component";

@Component({
  selector: "app-booked-sessions",
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
  templateUrl: "./booked-sessions.component.html",
  styleUrl: "./booked-sessions.component.scss",
})
export class BookedSessionsComponent {
  private bookedSessionsService = inject(BookedSessionsService);
  sessionsFilter = viewChild(BookSessionsFillterComponent);
  translationTemplate = TranslationTemplates.BOOKED_SESSION;
  APP_ROUTES = APP_ROUTES;
  readonly dialog = inject(MatDialog);
  private snackbarService = inject(SnackbarService);

  deleteSession(id: any) {
    this.dialog.open(ConfirmDeleteComponent, {
      data: {
        translationTemplate: this.translationTemplate,
        headerText: "CANCEL_BOOKING_HEADER",
        content:"CANCEL_BOOKING_CONTENT",
        cancelText:"NO",
        okText : "YES"
      },
    }).afterClosed().subscribe((res) => {
      if (res) {
        this.snackbarService.success("DELETE_BOOKED_SESSION_SUCCESS");
        this.bookedSessionsService.deleteSession(id).subscribe((res) => {
          this.sessionsFilter()?.getAll();
        });
      }
    });
  }
}
