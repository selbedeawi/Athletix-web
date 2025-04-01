import { Component, inject, signal, ViewChild, viewChild } from "@angular/core";
import { TranslationTemplates } from "../../shared/enums/translation-templates-enum";
import { APP_ROUTES } from "../../core/enums/pages-urls-enum";
import { MatDivider } from "@angular/material/divider";
import { MatCard, MatCardContent } from "@angular/material/card";
import { TranslocoDirective } from "@jsverse/transloco";
import { MatButtonModule } from "@angular/material/button";
import { MatPaginator } from "@angular/material/paginator";
import { EmptyResultComponent } from "../../shared/ui-components/templates/empty-result/empty-result.component";
import { PtSessionsFillterComponent } from "./components/pt-sessions-fillter/pt-sessions-fillter.component";
import { BookSessionDialogComponent } from "./components/book-session-dialog/book-session-dialog.component";
import { MatDialog } from "@angular/material/dialog";
import { PrivateSessionsBookingService } from "./services/pt-sessions.service";
import { TimeFormatPipe } from "../booked-sessions/time-format.pipe";
import { finalize } from "rxjs";
import { SnackbarService } from "../../core/services/snackbar/snackbar.service";
import { ConfirmDeleteComponent } from "../../shared/ui-components/templates/confirm-delete/confirm-delete.component";
import { HasRoleDirective } from "../../core/directives/has-role.directive";

@Component({
  selector: "app-pt-sessions",
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
    HasRoleDirective,
  ],
  templateUrl: "./pt-sessions.component.html",
  styleUrl: "./pt-sessions.component.scss",
})
export class PtSessionsComponent {
  private dialog = inject(MatDialog);
  private snackbarService = inject(SnackbarService);
  private privateSessionsService = inject(PrivateSessionsBookingService);
  translationTemplate = TranslationTemplates.PT_SESSION;
  APP_ROUTES = APP_ROUTES;
  ptSessionsFilter = viewChild(PtSessionsFillterComponent);
  BookedSessionData = "sss";
  loading = signal(false);

  constructor() {}
  openBookSessionDialog(): void {
    const dialogRef = this.dialog.open(BookSessionDialogComponent, {
      width: "600px",
      data: this.BookedSessionData,
    });

    dialogRef.afterClosed().subscribe((result) => {
      console.log("Dialog was closed", result);
    });
  }

  deleteSession(id: any) {
    this.dialog.open(ConfirmDeleteComponent, {
      data: {
        translationTemplate: this.translationTemplate,
        headerText: "CANCEL_BOOKING_HEADER",
        content: "CANCEL_BOOKING_CONTENT",
        cancelText: "NO",
        okText: "YES",
      },
    }).afterClosed().subscribe((res) => {
      if (res) {
        this.snackbarService.success("DELETE_BOOKED_SESSION_SUCCESS");
        this.privateSessionsService.deletePrivateSessionBooking(id).subscribe(
          (res) => {
            this.ptSessionsFilter()?.getAll();
          },
        );
      }
    });
  }
}
