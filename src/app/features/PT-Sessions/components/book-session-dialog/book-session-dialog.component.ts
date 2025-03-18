import { Component, inject, OnInit, signal } from '@angular/core';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { TranslocoDirective } from '@jsverse/transloco';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { TranslationTemplates } from '../../../../shared/enums/translation-templates-enum';
import { APP_ROUTES } from '../../../../core/enums/pages-urls-enum';
import { BridgesInputType } from '../../../../shared/ui-components/atoms/input/enum/bridges-input-type.enum';
import { LookupService } from '../../../../core/services/lookup/lookup.service';
import { DatePickerComponent } from '../../../../shared/ui-components/atoms/date-picker/date-picker.component';
import { MatDialogRef } from '@angular/material/dialog';
import { TimePickerComponent } from '../../../../shared/ui-components/atoms/time-picker/time-picker.component';
import {
  PrivateSessionsBookingInsert,
  PrivateSessionsBookingService,
} from '../../services/pt-sessions.service';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { AsyncPipe } from '@angular/common';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { finalize, map, Observable, startWith } from 'rxjs';
import { MemberAccount } from '../../../members-list/models/member';
import { MemberService } from '../../../members-list/services/member.service';
import { SelectComponent } from '../../../../shared/ui-components/atoms/select/select.component';
import { StaffService } from '../../../staff-list/services/staff.service';
import { AccountType } from '../../../../core/enums/account-type-enum';

@Component({
  selector: 'app-book-session-dialog',
  imports: [
    FormsModule,
    TranslocoDirective,
    MatButtonModule,
    MatCheckboxModule,
    DatePickerComponent,
    TimePickerComponent,
    MatFormFieldModule,
    MatInputModule,
    MatAutocompleteModule,
    ReactiveFormsModule,
    AsyncPipe,
    SelectComponent,
  ],
  templateUrl: './book-session-dialog.component.html',
  styleUrl: './book-session-dialog.component.scss',
})
export class BookSessionDialogComponent implements OnInit {
  private PrivateSessionsBookingService = inject(PrivateSessionsBookingService);
  private staffService = inject(StaffService);

  private dialogRef = inject(MatDialogRef<BookSessionDialogComponent>);
  memberService = inject(MemberService);

  translationTemplate = TranslationTemplates.PT_SESSION;
  APP_ROUTES = APP_ROUTES;

  bridgesInputType = BridgesInputType;
  lookupService = inject(LookupService);

  coachId: string = '';
  bookingDate: string | null = null;
  time: string | null = null;
  memberSearchValue: string = '';
  myControl = new FormControl('');
  options: MemberAccount[] = [];
  filteredOptions: Observable<MemberAccount[]> | undefined;
  loading = signal(false);
  pageSize = signal(10);
  pageNumber = signal(1);
  originalCount = signal(0);
  sessions = signal<any[]>([]);
  coachData = signal<any[]>([]);
  selectedCoach: any = null;
  filter: {
    role?: AccountType | null;
  } = {
    role: null,
  };
  ngOnInit(): void {
    this.getAllCoachs();
    this.getAllMembers();
  }
  createPrivateSessionBooking() {
    const booking: PrivateSessionsBookingInsert = {
      userMembershipId: this.memberSearchValue,
      coachId: this.selectedCoach ? this.selectedCoach.id : null,
      bookingDate: this.bookingDate,
      time: this.time,
    };
    this.PrivateSessionsBookingService.createPrivateSessionBooking(
      booking
    ).subscribe((res) => {
      console.log(res);
    });
  }
  getAllMembers() {
    this.loading.set(true);
    this.memberService
      .getAllMembers({}, this.pageNumber(), this.pageSize())
      .pipe(finalize(() => this.loading.set(false)))
      .subscribe((res) => {
        if (res.data) {
          this.originalCount.set((res as any).count || res.data?.length);
          this.options = res.data;
          this.filteredOptions = this.myControl.valueChanges.pipe(
            startWith(''),
            map((value) => this._filter(value || ''))
          );
        }
      });
  }
  private _filter(value: string): MemberAccount[] {
    const filterValue = value.toLowerCase();
    return this.options.filter((option) =>
      (option.firstName + ' ' + option.lastName)
        .toLowerCase()
        .includes(filterValue)
    );
  }

  getAllCoachs() {
    this.loading.set(true);
    const updatedFilter: { role: AccountType } = {
      role: 'Coach' as AccountType,
    };

    this.staffService
      .getAllStaff(updatedFilter)
      .pipe(finalize(() => this.loading.set(false)))
      .subscribe((res) => {
        if (res.data && Array.isArray(res.data)) {
          const formattedCoachData = res.data.map((coach) => ({
            ...coach,
            coachFullName: `${coach.firstName} ${coach.lastName}`,
          }));
          this.coachData.set(formattedCoachData);
        } else {
          this.coachData.set([]);
        }
      });
  }

  closeDialog(): void {
    this.dialogRef.close();
  }
}
