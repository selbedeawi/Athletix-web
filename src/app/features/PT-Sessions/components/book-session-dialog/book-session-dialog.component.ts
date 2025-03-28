import { Component, inject, OnDestroy, OnInit, signal } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { MatButtonModule } from "@angular/material/button";
import { TranslocoDirective } from "@jsverse/transloco";
import { MatCheckboxModule } from "@angular/material/checkbox";
import { TranslationTemplates } from "../../../../shared/enums/translation-templates-enum";
import { APP_ROUTES } from "../../../../core/enums/pages-urls-enum";
import { BridgesInputType } from "../../../../shared/ui-components/atoms/input/enum/bridges-input-type.enum";
import { LookupService } from "../../../../core/services/lookup/lookup.service";
import { DatePickerComponent } from "../../../../shared/ui-components/atoms/date-picker/date-picker.component";
import { MatDialogRef } from "@angular/material/dialog";
import { TimePickerComponent } from "../../../../shared/ui-components/atoms/time-picker/time-picker.component";
import {
  PrivateSessionsBookingInsert,
  PrivateSessionsBookingService,
} from "../../services/pt-sessions.service";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatInputModule } from "@angular/material/input";
import { MatAutocompleteModule } from "@angular/material/autocomplete";
import { debounceTime, filter, finalize, Subject, takeUntil } from "rxjs";
import { MemberAccount } from "../../../members-list/models/member";
import { MemberService } from "../../../members-list/services/member.service";
import { SelectComponent } from "../../../../shared/ui-components/atoms/select/select.component";
import { StaffService } from "../../../staff-list/services/staff.service";
import { BranchesService } from "../../../../core/services/branches/branches.service";
import { SnackbarService } from "../../../../core/services/snackbar/snackbar.service";
import { SelectStaffComponent } from "../../../../shared/ui-components/molecules/select-staff/select-staff.component";

@Component({
  selector: "app-book-session-dialog",
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

    SelectStaffComponent,
  ],
  templateUrl: "./book-session-dialog.component.html",
  styleUrls: ["./book-session-dialog.component.scss"],
})
export class BookSessionDialogComponent implements OnInit, OnDestroy {
  // Inject services using Angular's inject API
  private privateBookingService = inject(PrivateSessionsBookingService);

  private dialogRef = inject(MatDialogRef<BookSessionDialogComponent>);
  memberService = inject(MemberService);
  branchesService = inject(BranchesService);
  snackbarService = inject(SnackbarService);

  APP_ROUTES = APP_ROUTES;
  translationTemplate = TranslationTemplates.PT_SESSION;
  bridgesInputType = BridgesInputType;

  privateSession: PrivateSessionsBookingInsert = {};
  selectedMember: MemberAccount | undefined;

  memberOptions = signal<MemberAccount[]>([]);
  branchId!: string;

  loading = signal(false);
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
        this.branchId = branch.id;
        this.privateSession.branchId = branch.id;

        this.getAllMembers("");
      });
  }

  ngOnInit(): void {
    // Initialization logic if needed.
  }

  displayFn(user: MemberAccount): string {
    return user ? `${user.firstName} ${user.lastName}` : "";
  }

  createPrivateSessionBooking(): void {
    const clone = structuredClone(this.privateSession);
    const bookingDate = new Date(this.privateSession.bookingDate || "");
    clone.bookingDate = this.formatDate(bookingDate);
    this.privateBookingService.createPrivateSessionBooking(clone)
      .subscribe((res) => {
        if (!res.error) {
          this.snackbarService.success("CREATE_PRIVATE_SESSION_SUCCESS");
          this.dialogRef.close(true);
        }
      });
  }

  private formatDate(date: Date): string {
    const year = date.getFullYear();
    // Months are 0-based so we add 1
    const month = date.getMonth() + 1;
    const day = date.getDate();
    return `${year}-${month}-${day}`;
  }

  getAllMembers(searchQuery: string): void {
    this.loading.set(true);
    this.memberService.getAllMembers({
      searchQuery,
      branchId: this.branchId,
      isActive: true,
      type: "PrivateCoach",
    })
      .pipe(
        debounceTime(250),
        finalize(() => this.loading.set(false)),
      )
      .subscribe((res) => {
        if (res.data) {
          console.log(res.data);

          this.memberOptions.set(res.data);
        }
      });
  }

  closeDialog(): void {
    this.dialogRef.close();
  }

  ngOnDestroy(): void {
    this.destroyed$.next();
    this.destroyed$.complete();
  }
}
