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
  PrivateSessionBookingFilter,
  PrivateSessionsBookingService,
} from "../../services/pt-sessions.service";
import { TimePickerComponent } from "../../../../shared/ui-components/atoms/time-picker/time-picker.component";
import { sessionOption } from "../../../schedule-management/components/schedule-single-session/schedule-single-session.component";
import { SelectStaffComponent } from "../../../../shared/ui-components/molecules/select-staff/select-staff.component";
import { Tables } from "../../../../../../database.types";
import { HasRoleDirective } from "../../../../core/directives/has-role.directive";
import { BranchesService } from "../../../../core/services/branches/branches.service";
import { UserService } from "../../../../core/services/user/user.service";

@Component({
  selector: "app-pt-sessions-fillter",
  imports: [
    InputComponent,
    FormsModule,
    TranslocoDirective,
    MatButtonModule,
    DatePickerComponent,
    TimePickerComponent,
    SelectStaffComponent,
    HasRoleDirective,
  ],
  templateUrl: "./pt-sessions-fillter.component.html",
  styleUrl: "./pt-sessions-fillter.component.scss",
})
export class PtSessionsFillterComponent {
  private privateSessionsService = inject(PrivateSessionsBookingService);
  lookupService = inject(LookupService);
  branchesService = inject(BranchesService);
  userService = inject(UserService);
  translationTemplate: TranslationTemplates = TranslationTemplates.PT_SESSION;

  sessionOptions = signal<sessionOption[]>([]);
  sessions = signal<any[]>([]);

  filter: PrivateSessionBookingFilter = {
    searchKey: "",
    bookingDateFrom: undefined,
    bookingDateTo: undefined,
    branchId: "",
    coachId: "",
    userMembershipId: "",
    bookingTimeFrom: "",
    bookingTimeTo: "",
  };

  bridgesInputType = BridgesInputType;

  loading = signal(false);
  ptSessions = signal<Tables<"flattened_private_sessions_booking">[]>([]);

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
        if (this.userService.currentUser?.role === "Coach") {
          this.filter.coachId = this.userService.currentUser.id;
        }
        this.getAll();
      });
  }

  getAll() {
    this.loading.set(true);
    this.privateSessionsService
      .filterPrivateSessionsBooking(
        this.filter,
        this.pageNumber(),
        this.pageSize(),
      )
      .pipe(finalize(() => this.loading.set(false)))
      .subscribe((res) => {
        if (res) {
          this.ptSessions.set(res.data as any);
          this.originalCount.set((res as any).count);
        }
      });
  }

  reset() {
    this.filter = {
      searchKey: "",
      bookingDateFrom: "",
      bookingDateTo: "",
      branchId: "",
      coachId: "",
      userMembershipId: "",
      bookingTimeFrom: "",
      bookingTimeTo: "",
    };
    if (this.userService.currentUser?.role === "Coach") {
      this.filter.coachId = this.userService.currentUser.id;
    }
    this.search();
  }

  search() {
    this.pageNumber.set(1);
    this.getAll();
  }
}
