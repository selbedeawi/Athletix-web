import { DatePipe } from "@angular/common";
import {
  ChangeDetectionStrategy,
  Component,
  inject,
  signal,
} from "@angular/core";
import { FormsModule } from "@angular/forms";
import { MatButtonModule } from "@angular/material/button";
import { MatDividerModule } from "@angular/material/divider";
import { MatIconModule } from "@angular/material/icon";
import { MatSidenavModule } from "@angular/material/sidenav";
import { InputComponent } from "../../../../shared/ui-components/atoms/input/input.component";
import { CalendarEvent } from "angular-calendar";
import { ScheduleSession } from "../../models/schedule-session";
import { BridgesInputType } from "../../../../shared/ui-components/atoms/input/enum/bridges-input-type.enum";
import {
  BRDGS_OVERLAY_DATA,
  BrdgsOverlayRef,
} from "../../../../shared/services/brdgs-overlay.service";
import { MatDialog } from "@angular/material/dialog";
import { ScheduleSessionPopupComponent } from "../schedule-session-popup/schedule-session-popup.component";
import { TranslocoDirective } from "@jsverse/transloco";
import { TranslationTemplates } from "../../../../shared/enums/translation-templates-enum";
import {
  BookedSessionFilter,
  BookedSessionsService,
} from "../../../booked-sessions/services/booked-sessions.service";
import { finalize } from "rxjs";
import { ConfirmDeleteComponent } from "../../../../shared/ui-components/templates/confirm-delete/confirm-delete.component";
import { SnackbarService } from "../../../../core/services/snackbar/snackbar.service";
import { ScheduledSessionService } from "../../services/schedule-sessions.service";
import { HasRoleDirective } from "../../../../core/directives/has-role.directive";

@Component({
  selector: "app-schedule-session-details",
  imports: [
    FormsModule,
    MatSidenavModule,
    MatButtonModule,
    MatDividerModule,
    DatePipe,
    MatIconModule,
    InputComponent,
    TranslocoDirective,
    HasRoleDirective,
  ],
  templateUrl: "./schedule-session-details.component.html",
  styleUrl: "./schedule-session-details.component.scss",
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ScheduleSessionDetailsComponent {
  bookedSessionsService = inject(BookedSessionsService);
  overlayRef = inject(BrdgsOverlayRef);
  snackbarService = inject(SnackbarService);
  scheduledSessionService = inject(ScheduledSessionService);

  dialog = inject(MatDialog);
  public selectedSession: CalendarEvent<ScheduleSession> = inject(
    BRDGS_OVERLAY_DATA,
  );

  loading = signal(true);
  bookedSessions = signal<any[]>([]);
  bridgesInputType = BridgesInputType;
  translationTemplate: TranslationTemplates =
    TranslationTemplates.SCHEDULEDSESSION;
  filter: BookedSessionFilter = {
    searchKey: "",
    scheduledSessionId: this.selectedSession.meta?.id || "",
  };
  originalCount = signal(0);
  constructor() {
    this.getAllSessions();
  }

  closeOverlay() {
    this.overlayRef.close();
  }
  addMember() {
    this.dialog.open(ScheduleSessionPopupComponent, {
      data: this.selectedSession.meta,
      minWidth: 615,
    }).afterClosed().subscribe((result) => {
      if (result) {
        this.getAllSessions();
      }
    });
  }

  removeBooking(id: any) {
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
        this.bookedSessionsService.deleteSession(id).subscribe((res) => {
          this.getAllSessions();
        });
      }
    });
  }
  cancelScheduledSession(id: string) {
    this.dialog.open(ConfirmDeleteComponent, {
      data: {
        translationTemplate: this.translationTemplate,
        headerText: "CANCEL_SESSION_HEADER",
        content: "CANCEL_SESSION_CONTENT",
        cancelText: "NO",
        okText: "YES",
      },
    }).afterClosed().subscribe((res) => {
      if (res) {
        this.scheduledSessionService.cancelScheduledSession(id).subscribe(
          (res) => {
            this.overlayRef.close(true);
          },
        );
      }
    });
  }
  getAllSessions() {
    this.loading.set(true);

    if (this.filter) {
      this.bookedSessionsService
        .filterBookedSessions(this.filter, 1, 1000)
        .pipe(finalize(() => this.loading.set(false)))
        .subscribe((res) => {
          this.bookedSessions.set([...res.data as any]);
          // this.sessions.set(res);
          this.originalCount.set(res.count || 0);
        });
    } else {
      this.loading.set(false);
      console.error("Filter is not properly initialized.");
    }
  }
}
