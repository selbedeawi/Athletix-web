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
  BookedSessionFilter,
  BookedSessionsService,
} from '../../services/booked-sessions.service';

import { Tables } from '../../../../../../database.types';
import { TimePickerComponent } from '../../../../shared/ui-components/atoms/time-picker/time-picker.component';
import { SelectSessionsComponent } from "../../../../shared/ui-components/molecules/select-sessions/select-sessions.component";
@Component({
  selector: 'app-book-sessions-fillter',
  imports: [
    InputComponent,
    FormsModule,
    TranslocoDirective,
    MatButtonModule,
    DatePickerComponent,
    TimePickerComponent,
    SelectSessionsComponent
],
  templateUrl: './book-sessions-fillter.component.html',
  styleUrl: './book-sessions-fillter.component.scss',
})
export class BookSessionsFillterComponent {
  translationTemplate: TranslationTemplates =
    TranslationTemplates.BOOKED_SESSION;

  private bookedSessionsService = inject(BookedSessionsService);
  lookupService = inject(LookupService);

  filter: BookedSessionFilter = {
    searchKey: '',
    scheduledDateFrom: null,
    scheduledTimeFrom: null,
    scheduledDateTo: null,
    scheduledTimeTo: null,
    scheduledSessionId: '',
  };
  bridgesInputType = BridgesInputType;

  loading = signal(false);
  sessions = signal<Tables<'flattened_user_sessions_full'>[]>([]);

  pageSize = signal(10);
  pageNumber = signal(1);
  originalCount = signal(0);
  constructor() {
    this.getAll();
  }

  getAll() {
    this.loading.set(true);

    if (this.filter) {
      this.bookedSessionsService
        .filterBookedSessions(this.filter)
        .pipe(finalize(() => this.loading.set(false)))
        .subscribe((res) => {
          this.sessions.set(res);
          this.originalCount.set((res as any).count);
        });
    } else {
      this.loading.set(false);
      console.error('Filter is not properly initialized.');
    }
  }

  reset() {
    this.filter = {
      searchKey: '',
      scheduledDateFrom: null,
      scheduledSessionId: null,
      scheduledTimeFrom: null,
      scheduledDateTo: null,
      scheduledTimeTo: null,
    };
    console.log(this.filter);
    this.search();
  }

  search() {
    this.pageNumber.set(1);
    this.getAll();
  }
  get scheduledSessionId(): string {
    return this.filter.scheduledSessionId ?? ''; 
  }
  
  set scheduledSessionId(value: string) {
    this.filter.scheduledSessionId = value;
  }
  
}
