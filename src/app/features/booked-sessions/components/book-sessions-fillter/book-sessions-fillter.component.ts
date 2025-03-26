import { Component, inject, signal } from "@angular/core";
import { filter, finalize, Subject, takeUntil } from "rxjs";
import { BridgesInputType } from "../../../../shared/ui-components/atoms/input/enum/bridges-input-type.enum";
import { TranslationTemplates } from "../../../../shared/enums/translation-templates-enum";
import { LookupService } from "../../../../core/services/lookup/lookup.service";
import { InputComponent } from "../../../../shared/ui-components/atoms/input/input.component";
import { FormsModule } from "@angular/forms";
import { TranslocoDirective } from "@jsverse/transloco";
import { MatButtonModule } from "@angular/material/button";
import { DatePickerComponent } from "../../../../shared/ui-components/atoms/date-picker/date-picker.component";
import {
  BookedSessionFilter,
  BookedSessionsService,
} from "../../services/booked-sessions.service";
import { Tables } from "../../../../../../database.types";
import { TimePickerComponent } from "../../../../shared/ui-components/atoms/time-picker/time-picker.component";
import { SelectComponent } from "../../../../shared/ui-components/atoms/select/select.component";
import { sessionOption } from "../../../schedule-management/components/schedule-single-session/schedule-single-session.component";
import { BranchesService } from "../../../../core/services/branches/branches.service";
import { SessionService } from "../../../sessions-list/services/session.service";

@Component({
  selector: "app-book-sessions-fillter",
  imports: [
    InputComponent,
    FormsModule,
    TranslocoDirective,
    MatButtonModule,
    DatePickerComponent,
    TimePickerComponent,
    SelectComponent,
  ],
  templateUrl: "./book-sessions-fillter.component.html",
  styleUrl: "./book-sessions-fillter.component.scss",
})
export class BookSessionsFillterComponent {
  translationTemplate: TranslationTemplates =
    TranslationTemplates.BOOKED_SESSION;

  private bookedSessionsService = inject(BookedSessionsService);
  lookupService = inject(LookupService);
  sessionService = inject(SessionService);

  filter: BookedSessionFilter = {
    searchKey: "",
    scheduledDateFrom: null,
    scheduledTimeFrom: null,
    scheduledDateTo: null,
    scheduledTimeTo: null,
    scheduledSessionId: "",
    sessionId: "",
  };
  bridgesInputType = BridgesInputType;
  branchesService = inject(BranchesService);
  loading = signal(false);

  sessions = signal<Tables<"flattened_user_sessions_full">[]>([]);
  sessionOptions = signal<sessionOption[]>([]);

  pageSize = signal(10);
  pageNumber = signal(1);
  originalCount = signal(0);
  private destroyed$ = new Subject<void>();
  constructor() {
    this.branchesService.currentBranch$
      .pipe(
        filter((branch) => !!branch),
        takeUntil(this.destroyed$),
      )
      .subscribe((branch) => {
        this.filter.branchId = branch.id;
        this.sessionService.getAllSessions({ branchIds: [branch.id] })
          .subscribe((res) => {
            this.sessionOptions.set(
              res.data?.map((s) => {
                return { key: s.name, value: s.id };
              }),
            );
          });
        this.getAll();
      });
  }

  getAll() {
    this.loading.set(true);

    const filterPayload = {
      ...this.filter,
      scheduledDateFrom: this.convertDateToISO(this.filter.scheduledDateFrom),
      scheduledDateTo: this.convertDateToISO(this.filter.scheduledDateTo),
    };

    if (filterPayload) {
      this.bookedSessionsService
        .filterBookedSessions(filterPayload)
        .pipe(finalize(() => this.loading.set(false)))
        .subscribe((res) => {
          this.sessions.set(res);
          this.originalCount.set((res as any).count);
        });
    }
  }

  reset() {
    this.filter = {
      searchKey: "",
      scheduledDateFrom: null,
      scheduledSessionId: (null as any),
      scheduledTimeFrom: null,
      scheduledDateTo: null,
      scheduledTimeTo: null,
      sessionId: null as any,
    };
    this.search();
  }

  search() {
    this.pageNumber.set(1);
    this.getAll();
  }
  get scheduledSessionId(): string {
    return this.filter.scheduledSessionId ?? "";
  }

  set scheduledSessionId(value: string) {
    this.filter.scheduledSessionId = value;
  }

  setSession(sessionId?: any) {
    const selectedSession = this.sessions().find(
      (session) => session.scheduledSessionId === sessionId,
    );
    this.sessions.update((list) => {
      list.map((session) => {
        return {
          sessionId: "",
          createdAt: new Date().toISOString(),
          startTime: "14:00:00",
          endTime: "15:00:00",
          scheduledDate: new Date().toISOString(),
          branchId: "",
          createdBy: "",
        };
      });
      return list;
    });
  }

  convertDateToISO(date: string | Date | null | undefined): string | null {
    if (date instanceof Date && !isNaN(date.getTime())) {
      return date.toISOString();
    } else if (typeof date === "string" && date) {
      console.log(date);

      return new Date(date).toISOString();
    }
    return null;
  }
  ngOnDestroy(): void {
    this.destroyed$.next();
    this.destroyed$.complete();
  }
}
