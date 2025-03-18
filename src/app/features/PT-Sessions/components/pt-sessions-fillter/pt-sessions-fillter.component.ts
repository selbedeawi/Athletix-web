import { Component, inject, signal } from '@angular/core';
import { finalize } from 'rxjs';
import { BridgesInputType } from '../../../../shared/ui-components/atoms/input/enum/bridges-input-type.enum';
import { TranslationTemplates } from '../../../../shared/enums/translation-templates-enum';
import { LookupService } from '../../../../core/services/lookup/lookup.service';
import { InputComponent } from '../../../../shared/ui-components/atoms/input/input.component';
import { FormsModule } from '@angular/forms';
import { TranslocoDirective } from '@jsverse/transloco';
import { MatButtonModule } from '@angular/material/button';
import { DatePickerComponent } from '../../../../shared/ui-components/atoms/date-picker/date-picker.component';
import {
  PrivateSessionBookingFilter,
  PrivateSessionsBookingService,
} from '../../services/pt-sessions.service';
import { TimePickerComponent } from '../../../../shared/ui-components/atoms/time-picker/time-picker.component';
import { sessionOption } from '../../../schedule-management/components/schedule-single-session/schedule-single-session.component';
import { SelectComponent } from "../../../../shared/ui-components/atoms/select/select.component";

@Component({
  selector: 'app-pt-sessions-fillter',
  imports: [
    InputComponent,
    FormsModule,
    TranslocoDirective,
    MatButtonModule,
    DatePickerComponent,
    TimePickerComponent,
    SelectComponent
],
  templateUrl: './pt-sessions-fillter.component.html',
  styleUrl: './pt-sessions-fillter.component.scss',
})
export class PtSessionsFillterComponent {
  private privateSessionsService = inject(PrivateSessionsBookingService);
  lookupService = inject(LookupService);
  translationTemplate: TranslationTemplates = TranslationTemplates.PT_SESSION;
  
  sessionOptions = signal<sessionOption[]>([]);
  sessions = signal<any[]>([]);

  filter: PrivateSessionBookingFilter = {
    searchKey: '',
    bookingDateFrom: '',
    bookingDateTo: '',
    branchId: '',
    coachId: '',
    userMembershipId: '',
    bookingTimeFrom: '',
    bookingTimeTo: '',
  };

  bridgesInputType = BridgesInputType;

  loading = signal(false);
  ptSessions = signal<any[]>([]);

  pageSize = signal(10);
  pageNumber = signal(1);
  originalCount = signal(0);
  constructor() {
    this.getAll();
  }

  getAll() {
    this.loading.set(true);
    console.log('Sending filter data:', this.filter);
    this.privateSessionsService
      .filterPrivateSessionsBooking(this.filter)
      .pipe(finalize(() => this.loading.set(false)))
      .subscribe((res) => {
        if (res) {
          this.ptSessions.set(res);
          this.sessions().forEach((session) => {
            this.sessionOptions().push({
              key: session.membership_name??'',
              value: session.scheduledSessionId??'',
            });
          });
          this.originalCount.set((res as any).count);
        }
      });
  }

  reset() {
    this.filter = {
      searchKey: '',
      bookingDateFrom: '',
      bookingDateTo: '',
      branchId: '',
      coachId: '',
      userMembershipId: '',
      bookingTimeFrom: '',
      bookingTimeTo: '',
    };
    this.search();
  }

  search() {
    if (!this.filter.bookingTimeFrom) {
      this.filter.bookingTimeFrom = '';  
    }
    if (!this.filter.bookingTimeTo) {
      this.filter.bookingTimeTo = '';  
    }
  
    console.log('Filter before sending request:', this.filter);
    this.pageNumber.set(1);
    this.getAll();
  }
  get scheduledSessionId(): string {
    return this.filter.bookingSessionId ?? ''; 
  }
  
  set scheduledSessionId(value: string) {
    this.filter.bookingSessionId = value;
  }

  setSession(sessionId?: any) {
    const selectedSession = this.sessions().find(
      (session) => session.scheduledSessionId === sessionId
    );
    console.log(selectedSession);
    this.sessions.update((list) => {
      list.map((session) => {
        return {
          sessionId: '',
          createdAt: new Date().toISOString(),
          startTime: '14:00:00',
          endTime: '15:00:00',
          scheduledDate: new Date().toISOString(),
          branchId: '',
          createdBy: '',
        };
      });
      return list;
    });
    console.log(this.sessions);
  }
}
