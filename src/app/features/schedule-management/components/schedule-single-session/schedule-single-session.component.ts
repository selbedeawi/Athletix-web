import {
  ChangeDetectionStrategy,
  Component,
  inject,
  signal,
} from "@angular/core";
import { FormsModule, NgForm } from "@angular/forms";
import { MatButtonModule } from "@angular/material/button";
import { TranslocoDirective } from "@jsverse/transloco";
import { DatePickerComponent } from "../../../../shared/ui-components/atoms/date-picker/date-picker.component";
import { SelectComponent } from "../../../../shared/ui-components/atoms/select/select.component";
import { BridgesInputType } from "../../../../shared/ui-components/atoms/input/enum/bridges-input-type.enum";
import { TranslationTemplates } from "../../../../shared/enums/translation-templates-enum";
import { MatDivider } from "@angular/material/divider";
import { MatRadioModule } from "@angular/material/radio";
import { TimePickerComponent } from "../../../../shared/ui-components/atoms/time-picker/time-picker.component";
import { SessionService } from "../../../sessions-list/services/session.service";
import { debounceTime, filter, finalize, Subject, takeUntil } from "rxjs";
import { Sessions } from "../../../sessions-list/models/sessions";
import {
  ScheduledSessionInsert,
  ScheduledSessionService,
} from "../../services/schedule-sessions.service";
import { BranchesService } from "../../../../core/services/branches/branches.service";
import { UserService } from "../../../../core/services/user/user.service";
import { StaffAccount } from "../../../staff-list/models/staff";
import { MatOptionModule } from "@angular/material/core";
import { StaffService } from "../../../staff-list/services/staff.service";
import { AccountType } from "../../../../core/enums/account-type-enum";
import { MatDialogModule, MatDialogRef } from "@angular/material/dialog";
import { SnackbarService } from "../../../../core/services/snackbar/snackbar.service";
import { addDays, format } from "date-fns";
import { SelectStaffComponent } from "../../../../shared/ui-components/molecules/select-staff/select-staff.component";
export interface sessionOption {
  key: string;
  value: string;
}

@Component({
  selector: "app-schedule-single-session",
  imports: [
    SelectComponent,
    FormsModule,
    TranslocoDirective,
    MatButtonModule,
    DatePickerComponent,
    TimePickerComponent,
    MatDivider,
    MatRadioModule,
    MatOptionModule,
    MatDialogModule,
    SelectStaffComponent,
  ],
  templateUrl: "./schedule-single-session.component.html",
  styleUrl: "./schedule-single-session.component.scss",
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ScheduleSingleSessionComponent {
  private sessionService = inject(SessionService);
  branchService = inject(BranchesService);
  userService = inject(UserService);

  dialogRef = inject(MatDialogRef);
  snackBar = inject(SnackbarService);
  private scheduledSessionService = inject(ScheduledSessionService);

  translationTemplate: TranslationTemplates =
    TranslationTemplates.SCHEDULEDSESSION;

  coachesId = signal<string[]>([]);
  sessionId = signal<string>("");
  date = new Date();
  insertedSession = signal<ScheduledSessionInsert>({
    sessionId: "",
    createdAt: "",
    startTime: "",
    endTime: "",
    scheduledDate: "",
    branchId: "",
    createdBy: "",
  });
  scheduledSessions = signal<ScheduledSessionInsert[]>([
    this.insertedSession(),
  ]);
  endDate = signal<Date | null>(null);
  sessionDays = signal<string[]>([]);
  sessionDaysMap = signal(new Map());
  sessionDaysKeys = signal<string[]>([]);
  sessionOptions = signal<sessionOption[]>([]);
  daysOptions = signal<sessionOption[]>([
    { key: "Saturday", value: "saturday" },
    { key: "Sunday", value: "sunday" },
    { key: "Monday", value: "monday" },
    { key: "Tuesday", value: "tuesday" },
    { key: "Wednesday", value: "wednesday" },
    { key: "Thursday", value: "thursday" },
    { key: "Friday", value: "friday" },
  ]);
  isRepeated = signal(false);
  loading = signal(false);

  bridgesInputType = BridgesInputType;
  filterCoach: {
    name: string;
    isActive: boolean | "All";
    role: AccountType;
    branchIds: string[];
  } = {
    name: "",
    isActive: true,
    role: "Coach",
    branchIds: [],
  };
  filter: {
    name?: string;
    branchIds?: string[];
  } = {
    name: "",
    branchIds: [],
  };
  private destroyed$ = new Subject<void>();
  constructor() {
    this.branchService.currentBranch$
      .pipe(
        filter((branch) => !!branch),
        takeUntil(this.destroyed$),
      )
      .subscribe((branch) => {
        this.sessionService.getAllSessions({ branchIds: [branch.id] })
          .subscribe((res) => {
            this.sessionOptions.set(
              res.data?.map((s) => {
                return { key: s.name, value: s.id };
              }),
            );
          });
      });
  }
  schedule(sessionForm: NgForm) {
    if (!this.isRepeated()) {
      this.singleScheduleSession();
    }
    this.multipleScheduleSessions();
  }

  singleScheduleSession() {
    this.loading.set(true);
    const scheduledDate = new Date(
      this.scheduledSessions()[0].scheduledDate || "",
    );

    const insertedSession: ScheduledSessionInsert = {
      sessionId: this.sessionId(),
      startTime: this.scheduledSessions()[0].startTime,
      endTime: this.scheduledSessions()[0].endTime,
      scheduledDate: `${scheduledDate.getFullYear()}-${
        scheduledDate.getMonth() + 1
      }-${scheduledDate.getDate()}`,
      branchId: this.branchService.currentBranch?.id,
      createdBy: this.userService.currentUser?.id,
    };
    this.scheduledSessionService
      .addSingleScheduledSession(insertedSession, this.coachesId())
      .pipe(finalize(() => this.loading.set(false)))
      .subscribe({
        next: (res) => {
          this.snackBar.success("Session Scheduled Successfully");
          this.dialogRef.close(true);
        },
        error: (err) => {
          this.snackBar.error(err.message || "Something went wrong");
        },
      });
  }
  multipleScheduleSessions() {
    const insertedSessions: {
      session: ScheduledSessionInsert;
      coachIds: string[];
    }[] = [];
    this.getMatchingDates();
    this.scheduledSessions().forEach((session, i) => {
      this.sessionDaysMap()
        .get(this.sessionDaysKeys()[i])[0]
        .forEach((day: Date) => {
          insertedSessions.push({
            session: {
              sessionId: this.sessionId(),
              startTime: this.scheduledSessions()[i].startTime,
              endTime: this.scheduledSessions()[i].endTime,
              scheduledDate: `${day.getFullYear()}-${
                day.getMonth() + 1
              }-${day.getDate()}`,
              branchId: this.branchService.currentBranch?.id,
              createdBy: this.userService.currentUser?.id,
            },
            coachIds: [...this.coachesId()],
          });
        });
    });
    this.scheduledSessionService
      .addMultipleScheduledSessions(insertedSessions)
      .pipe(finalize(() => this.loading.set(false)))
      .subscribe({
        next: (res) => {
          this.snackBar.success("Sessions Scheduled Successfully");
          this.dialogRef.close(true);
        },
        error: (err) => {
          this.snackBar.error(err.message || "Something went wrong");
        },
      });
  }

  addAnotherDay() {
    this.scheduledSessions().push(structuredClone(this.insertedSession()));
  }

  updateTime(event: any, session: ScheduledSessionInsert) {
    session.endTime = this.addOneHour(event);
    console.log(this.addOneHour(event));
  }

  addOneHour(time: string) {
    const numArray = time.split(":");
    let hour;
    let min = numArray[1];
    if (numArray[0] == "23") {
      hour = "23";
      min = "59";
    } else hour = Number(numArray[0]) + 1;
    return `${hour}:${min}`;
  }

  removeSession(index: number) {
    this.scheduledSessions.update((sessions) => {
      sessions.splice(index, 1);
      return [...sessions];
    });
    this.sessionDays.update((sessions) => {
      sessions.splice(index, 1);
      return [...sessions];
    });
    this.getMatchingDates();
  }

  getMatchingDates() {
    const start = new Date(this.scheduledSessions()[0].scheduledDate || "");
    this.sessionDaysKeys.set([]);
    this.sessionDaysMap.set(new Map());
    let current = start;
    let counter = 0;
    let daysArray: Date[] = [];
    const endDate = this.endDate() || new Date();
    this.sessionDays().forEach((sessionDay) => {
      while (current <= endDate) {
        const dayName = format(current, "EEEE").toLowerCase();
        if (sessionDay == dayName) {
          daysArray.push(current);
          this.sessionDaysMap.update((map) => {
            map.set(sessionDay + counter, [daysArray]);
            return map;
          });
        }
        current = addDays(current, 1); // Move to the next day
      }
      this.sessionDaysKeys.set([...this.sessionDaysMap().keys()]);
      daysArray = [];
      counter++;

      current = start;
    });
  }
}
