import { CommonModule, DatePipe, NgClass, SlicePipe } from "@angular/common";
import { Component, computed, inject, signal } from "@angular/core";
import { CalendarEvent, CalendarModule, CalendarView } from "angular-calendar";

import { ScheduleCalendarHeaderComponent } from "./components/schedule-calendar-header/schedule-calendar-header.component";
import {
  ScheduledSessionFilter,
  ScheduledSessionService,
} from "./services/schedule-sessions.service";
import {
  endOfMonth,
  format,
  isSameDay,
  isSameMonth,
  startOfMonth,
} from "date-fns";
import { filter, finalize, Subject, takeUntil } from "rxjs";
import { ScheduleSession } from "./models/schedule-session";
import { BridgesInputType } from "../../shared/ui-components/atoms/input/enum/bridges-input-type.enum";
import { BrdgsOverlayService } from "../../shared/services/brdgs-overlay.service";
import { ScheduleSessionDetailsComponent } from "./components/schedule-session-details/schedule-session-details.component";
import { TranslocoDirective } from "@jsverse/transloco";
import { TranslationTemplates } from "../../shared/enums/translation-templates-enum";
import { MatButtonModule } from "@angular/material/button";
import { MatDialog } from "@angular/material/dialog";
import { ScheduleSingleSessionComponent } from "./components/schedule-single-session/schedule-single-session.component";
import { BranchesService } from "../../core/services/branches/branches.service";

@Component({
  selector: "app-schedule-management",
  imports: [
    CalendarModule,
    NgClass,
    ScheduleCalendarHeaderComponent,
    TranslocoDirective,
    MatButtonModule,
    DatePipe,
  ],
  templateUrl: "./schedule-management.component.html",
  styleUrl: "./schedule-management.component.scss",
})
export class ScheduleManagementComponent {
  private scheduleSessionService = inject(ScheduledSessionService);
  private brdgsOverlayService = inject(BrdgsOverlayService);
  dialog = inject(MatDialog);

  viewDate = signal(new Date());
  selectedSession = signal<CalendarEvent<ScheduleSession> | null>(null);
  events = signal<CalendarEvent<ScheduleSession>[]>([]);
  loading = signal(false);
  activeDayIsOpen = signal(false);

  monthStart = computed(() =>
    format(startOfMonth(this.viewDate()), "yyyy-LL-dd")
  );

  monthEnd = computed(() => format(endOfMonth(this.viewDate()), "yyyy-LL-dd"));

  view: CalendarView = CalendarView.Month;

  bridgesInputType = BridgesInputType;
  translationTemplate = TranslationTemplates.SCHEDULEDSESSION;
  branchId!: string;
  branchesService = inject(BranchesService);
  private destroyed$ = new Subject<void>();
  constructor() {
    this.branchesService.currentBranch$
      .pipe(
        filter((branch) => !!branch),
        takeUntil(this.destroyed$),
      )
      .subscribe((branch) => {
        this.branchId = branch.id;
        this.getFilteredSessions();
      });
  }
  getFilteredSessions() {
    this.loading.set(true);
    const filter: ScheduledSessionFilter = {
      scheduledDateFrom: this.monthStart(),
      scheduledDateTo: this.monthEnd(),
      branchId: this.branchId,
    };
    this.scheduleSessionService
      .filterScheduledSessions(filter)
      .pipe(finalize(() => this.loading.set(true)))
      .subscribe({
        next: (res) => {
          this.events.set([]);
          res.forEach((session) => {
            this.events.update((eventList) => {
              eventList.push({
                id: session.sessionId,
                start: new Date(
                  session.scheduledDate! + "T" + session.startTime,
                ),
                end: new Date(session.scheduledDate! + "T" + session.endTime),
                title: session.Sessions.name,
                meta: { ...session },
              });
              return [...eventList];
            });
          });
        },
      });
  }

  openSingleSession(event: CalendarEvent<ScheduleSession>) {
    this.brdgsOverlayService.open(ScheduleSessionDetailsComponent, event);
  }
  scheduleSingleSession() {
    this.dialog
      .open(ScheduleSingleSessionComponent, {
        minWidth: 615,
      })
      .afterClosed()
      .subscribe((result) => {
        if (result) {
          this.getFilteredSessions();
        }
      });
  }
  dayClicked({ date, events }: { date: Date; events: CalendarEvent[] }): void {
    if (isSameMonth(date, this.viewDate())) {
      if (
        (isSameDay(this.viewDate(), date) && this.activeDayIsOpen()) ||
        events.length === 0
      ) {
        this.activeDayIsOpen.set(false);
      } else {
        this.activeDayIsOpen.set(true);
      }
      this.viewDate.set(date);
    }
  }
  ngOnDestroy(): void {
    this.destroyed$.next();
    this.destroyed$.complete();
  }
}
