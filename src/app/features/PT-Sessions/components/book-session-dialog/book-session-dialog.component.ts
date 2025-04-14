import { Component, inject, OnDestroy, OnInit, signal } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { MatButtonModule } from "@angular/material/button";
import { TranslocoDirective } from "@jsverse/transloco";
import { MatCheckboxModule } from "@angular/material/checkbox";
import { TranslationTemplates } from "../../../../shared/enums/translation-templates-enum";
import { APP_ROUTES } from "../../../../core/enums/pages-urls-enum";
import { BridgesInputType } from "../../../../shared/ui-components/atoms/input/enum/bridges-input-type.enum";
import { DatePickerComponent } from "../../../../shared/ui-components/atoms/date-picker/date-picker.component";
import { MatDialogRef } from "@angular/material/dialog";
import { TimePickerComponent } from "../../../../shared/ui-components/atoms/time-picker/time-picker.component";
import {
  PrivateSessionsBookingInsert,
  PrivateSessionsBookingService,
} from "../../services/pt-sessions.service";
import { filter, Subject, takeUntil } from "rxjs";
import { BranchesService } from "../../../../core/services/branches/branches.service";
import { SnackbarService } from "../../../../core/services/snackbar/snackbar.service";
import { SelectStaffComponent } from "../../../../shared/ui-components/molecules/select-staff/select-staff.component";
import { SelectMemberComponent } from "../../../../shared/ui-components/molecules/select-member/select-member.component";
import { MemberAccount } from "../../../members-list/models/member";
import { UserService } from "../../../../core/services/user/user.service";
import { HasRoleDirective } from "../../../../core/directives/has-role.directive";

@Component({
  selector: "app-book-session-dialog",
  imports: [
    FormsModule,
    TranslocoDirective,
    MatButtonModule,
    MatCheckboxModule,
    DatePickerComponent,
    TimePickerComponent,
    HasRoleDirective,
    SelectStaffComponent,
    SelectMemberComponent,
  ],
  templateUrl: "./book-session-dialog.component.html",
  styleUrls: ["./book-session-dialog.component.scss"],
})
export class BookSessionDialogComponent implements OnInit, OnDestroy {
  // Inject services using Angular's inject API
  private privateBookingService = inject(PrivateSessionsBookingService);

  private dialogRef = inject(MatDialogRef<BookSessionDialogComponent>);
  userService = inject(UserService);
  branchesService = inject(BranchesService);
  snackbarService = inject(SnackbarService);

  APP_ROUTES = APP_ROUTES;
  translationTemplate = TranslationTemplates.PT_SESSION;
  bridgesInputType = BridgesInputType;

  privateSession: PrivateSessionsBookingInsert = {} as any;

  branchId!: string;
  coachId = signal<string | undefined>(undefined);

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
        if (this.userService.currentUser?.role === "Coach") {
          this.coachId.set(this.userService.currentUser.id);
          this.privateSession.coachId = this.userService.currentUser.id;
        }
      });
  }

  ngOnInit(): void {
    // Initialization logic if needed.
  }
  setPtForMember(memberAccount: MemberAccount) {
    this.privateSession.userMembershipId = memberAccount.UserMembership.id;
    if (memberAccount.UserMembership.type === "PrivateCoach") {
      this.privateSession.coachId = memberAccount.UserMembership.coachId as any;
    } else {
      if (this.userService.currentUser?.role === "Coach") {
        this.privateSession.coachId = this.userService.currentUser.id;
      } else {
        this.privateSession.coachId = null as any;
      }
    }
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

  closeDialog(): void {
    this.dialogRef.close();
  }

  ngOnDestroy(): void {
    this.destroyed$.next();
    this.destroyed$.complete();
  }
}
