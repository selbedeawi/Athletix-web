import {
  ChangeDetectionStrategy,
  Component,
  inject,
  signal,
} from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { TranslocoDirective } from '@jsverse/transloco';
import { DatePickerComponent } from '../../../../shared/ui-components/atoms/date-picker/date-picker.component';
import { SelectComponent } from '../../../../shared/ui-components/atoms/select/select.component';
import { BridgesInputType } from '../../../../shared/ui-components/atoms/input/enum/bridges-input-type.enum';
import { TranslationTemplates } from '../../../../shared/enums/translation-templates-enum';
import { MatDivider } from '@angular/material/divider';
import { MatRadioModule } from '@angular/material/radio';
import { TimePickerComponent } from '../../../../shared/ui-components/atoms/time-picker/time-picker.component';
import { SessionService } from '../../../sessions-list/services/session.service';
import { debounceTime, finalize } from 'rxjs';
import { Sessions } from '../../../sessions-list/models/sessions';
import {
  ScheduledSessionInsert,
  ScheduledSessionService,
} from '../../services/schedule-sessions.service';
import { BranchesService } from '../../../../core/services/branches/branches.service';
import { UserService } from '../../../../core/services/user/user.service';
import { StaffAccount } from '../../../staff-list/models/staff';
import { MatOptionModule } from '@angular/material/core';
import { StaffService } from '../../../staff-list/services/staff.service';
import { AccountType } from '../../../../core/enums/account-type-enum';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { SnackbarService } from '../../../../core/services/snackbar/snackbar.service';
import { addDays, format } from 'date-fns';
export interface sessionOption {
  key: string;
  value: string;
}
@Component({
  selector: 'app-schedule-single-session',
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
  ],
  templateUrl: './schedule-single-session.component.html',
  styleUrl: './schedule-single-session.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ScheduleSingleSessionComponent {
  private sessionService = inject(SessionService);
  branchService = inject(BranchesService);
  userService = inject(UserService);
  staffService = inject(StaffService);
  dialogRef = inject(MatDialogRef);
  snackBar = inject(SnackbarService);
  private scheduledSessionService = inject(ScheduledSessionService);

  translationTemplate: TranslationTemplates =
    TranslationTemplates.SCHEDULEDSESSION;
  coaches = signal<StaffAccount[]>([]);
  selectedCoaches = signal<StaffAccount[]>([]);
  coachesId = signal<string[]>([]);
  sessionId = signal<string>('');
  date = new Date();
  insertedSession = signal<ScheduledSessionInsert>({
    sessionId: '',
    createdAt: '',
    startTime: '',
    endTime: '',
    scheduledDate: '',
    branchId: '',
    createdBy: '',
  });
  scheduledSessions = signal<ScheduledSessionInsert[]>([
    this.insertedSession(),
  ]);
  endDate = signal<Date>(new Date());
  sessionDays = signal<string[]>([]);
  sessionDaysMap = signal(new Map());
  sessionDaysKeys = signal<string[]>([]);

  sessions = signal<Sessions[]>([]);
  sessionOptions = signal<sessionOption[]>([]);
  coachOptions = signal<sessionOption[]>([]);
  daysOptions = signal<sessionOption[]>([
    { key: 'Saturday', value: 'saturday' },
    { key: 'Sunday', value: 'sunday' },
    { key: 'Monday', value: 'monday' },
    { key: 'Tuesday', value: 'tuesday' },
    { key: 'Wednesday', value: 'wednesday' },
    { key: 'Thursday', value: 'thursday' },
    { key: 'Friday', value: 'friday' },
  ]);
  isRepeated = signal(false);
  loading = signal(false);

  bridgesInputType = BridgesInputType;
  filterCoach: {
    name: string;
    isActive: boolean | 'All';
    role: AccountType;
    branchIds: string[];
  } = {
    name: '',
    isActive: true,
    role: 'Coach',
    branchIds: [],
  };
  filter: {
    name?: string;
    branchIds?: string[];
  } = {
    name: '',
    branchIds: [],
  };
  constructor() {
    this.getAllSessions();
    this.getAllCoaches();
  }
  schedule(sessionForm: NgForm) {
    if (!this.isRepeated()) {
      this.singleScheduleSession();
    }
    this.multipleScheduleSessions();
  }

  singleScheduleSession() {
    this.loading.set(true);

    // console.log(this.coachesId());
    const insertedSession: ScheduledSessionInsert = {
      sessionId: this.sessionId(),
      createdAt: new Date(
        this.date.getFullYear(),
        this.date.getMonth(),
        this.date.getDate(),
        0,
        0,
        0,
        0
      ).toISOString(),
      startTime: this.scheduledSessions()[0].startTime,
      endTime: this.scheduledSessions()[0].endTime,
      scheduledDate: new Date(
        this.scheduledSessions()[0].scheduledDate || ''
      ).toISOString(),
      branchId: this.branchService.currentBranch?.id,
      createdBy: this.userService.currentUser?.id,
    };
    // console.log(this.scheduledSessions());

    this.scheduledSessionService
      .addSingleScheduledSession(insertedSession, this.coachesId())
      .pipe(finalize(() => this.loading.set(false)))
      .subscribe({
        next: (res) => {
          // console.log(res);
          this.snackBar.success('Session Scheduled Successfully');
          this.dialogRef.close(true);
        },
        error: (err) => {
          this.snackBar.error(err.message || 'Something went wrong');
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
              createdAt: new Date(
                this.date.getFullYear(),
                this.date.getMonth(),
                this.date.getDate(),
                0,
                0,
                0,
                0
              ).toISOString(),
              startTime: this.scheduledSessions()[i].startTime,
              endTime: this.scheduledSessions()[i].endTime,
              scheduledDate: new Date(day).toISOString(),
              branchId: this.branchService.currentBranch?.id,
              createdBy: this.userService.currentUser?.id,
            },
            coachIds: [...this.coachesId()],
          });
        });
    });
    // console.log(insertedSessions);
    this.scheduledSessionService
      .addMultipleScheduledSessions(insertedSessions)
      .pipe(finalize(() => this.loading.set(false)))
      .subscribe({
        next: (res) => {
          // console.log(res);
          this.snackBar.success('Sessions Scheduled Successfully');
          this.dialogRef.close(true);
        },
        error: (err) => {
          this.snackBar.error(err.message || 'Something went wrong');
        },
      });
  }

  getAllSessions() {
    this.loading.set(true);

    this.sessionService
      .getAllSessions(this.filter)
      .pipe(finalize(() => this.loading.set(false)))
      .subscribe((res) => {
        this.sessions.set(res.data);
        this.sessions().forEach((session) => {
          this.sessionOptions().push({ key: session.name, value: session.id });
        });
        // console.log(this.sessions());
      });
  }

  addAnotherDay() {
    this.scheduledSessions().push(structuredClone(this.insertedSession()));
  }

  setSession(sessionId?: string) {
    const selectedSession = this.sessions().find(
      (session) => session.id === sessionId
    );
    if (selectedSession) {
      this.scheduledSessions.update((sessionList) => {
        sessionList.map((session) => (session.sessionId = selectedSession.id));
        return [...sessionList];
      });
      // console.log(this.scheduledSessions());
    }

    // this.sessions.update(list=>{
    //   list.map(session=>{
    //     return {
    //        sessionId: '',
    // createdAt: new Date().toISOString(),
    // startTime: '14:00:00',
    // endTime: '15:00:00',
    // scheduledDate: new Date().toISOString(),
    // branchId: '',
    // createdBy: '',
    //     }
    //   })
    //   return list
    // })
  }
  updateTime(event: any, session: ScheduledSessionInsert) {
    // console.log(event);
    // session.startTime = `${session.startTime}:00`
    session.endTime = this.addOneHour(event);
    // console.log(session);
    // console.log(this.scheduledSessions());
  }

  addOneHour(time: string) {
    const numArray = time.split(':');
    let hour;
    if (numArray[0] == '23') {
      hour = '00';
    } else hour = Number(numArray[0]) + 1;
    return `${hour}:${numArray[1]}`;
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
  // setMember(member: StaffAccount) {
  // console.log(member)
  //   if (member) {
  //     this.selectedCoaches().push(member);
  //     this.coachesId().push(member.id);
  //   }
  //   this.filterCoach.name = '';
  //   this.coaches.set([]);
  // }
  getAllCoaches() {
    this.loading.set(true);
    this.staffService
      .getAllStaff(this.filterCoach)
      .pipe(
        finalize(() => this.loading.set(false)),
        debounceTime(250)
      )
      .subscribe((res) => {
        console.log(res)
        if (res.data) {
          this.coaches.set(res.data);
          this.coaches().forEach((coach) => {
            this.coachOptions().push({
              key: coach.firstName + coach.lastName,
              value: coach.id,
            });
          });
          // console.log(this.coaches());
        }
      });
  }
  getMatchingDates() {
    const start = new Date(this.scheduledSessions()[0].scheduledDate || '');
    this.sessionDaysKeys.set([]);
    this.sessionDaysMap.set(new Map());
    let current = start;
    let counter = 0;
    let daysArray: Date[] = [];

    this.sessionDays().forEach((sessionDay) => {
      while (current <= this.endDate()) {
        const dayName = format(current, 'EEEE').toLowerCase();
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
    // console.log(this.sessionDaysKeys());
    // console.log(this.sessionDaysMap());
  }
}
