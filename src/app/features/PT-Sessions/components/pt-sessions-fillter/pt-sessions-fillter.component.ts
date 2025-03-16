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
import { SelectSessionsComponent } from "../../../../shared/ui-components/molecules/select-sessions/select-sessions.component";

@Component({
  selector: 'app-pt-sessions-fillter',
  imports: [
    InputComponent,
    FormsModule,
    TranslocoDirective,
    MatButtonModule,
    DatePickerComponent,
    TimePickerComponent,
    SelectSessionsComponent
],
  templateUrl: './pt-sessions-fillter.component.html',
  styleUrl: './pt-sessions-fillter.component.scss',
})
export class PtSessionsFillterComponent {
  translationTemplate: TranslationTemplates = TranslationTemplates.PT_SESSION;

  private privateSessionsService = inject(PrivateSessionsBookingService);
  lookupService = inject(LookupService);
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

    this.privateSessionsService
      .filterPrivateSessionsBooking(this.filter)
      .pipe(finalize(() => this.loading.set(false)))
      .subscribe((res) => {
        if (res) {
          this.ptSessions.set(res);
          console.log(this.ptSessions());
          this.originalCount.set((res as any).count);
          console.log(this.originalCount());
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
    this.pageNumber.set(1);
    this.getAll();
  }
  get scheduledSessionId(): string {
    return this.filter.bookingSessionId ?? ''; 
  }
  
  set scheduledSessionId(value: string) {
    this.filter.bookingSessionId = value;
  }
}
