import { Component, inject, signal } from "@angular/core";
import {
  MAT_DIALOG_DATA,
  MatDialogModule,
  MatDialogRef,
} from "@angular/material/dialog";
import { ScheduleSession } from "../../models/schedule-session";
import { FormsModule } from "@angular/forms";
import { MatDivider } from "@angular/material/divider";
import { MatButtonModule } from "@angular/material/button";
import {
  MemberAccount,
  UserMembership,
} from "../../../members-list/models/member";
import { TranslocoDirective } from "@jsverse/transloco";
import { TranslationTemplates } from "../../../../shared/enums/translation-templates-enum";
import { SnackbarService } from "../../../../core/services/snackbar/snackbar.service";
import { UserService } from "../../../../core/services/user/user.service";
import { BranchesService } from "../../../../core/services/branches/branches.service";
import {
  BookedSessionsService,
  UserSessionInsert,
} from "../../../booked-sessions/services/booked-sessions.service";
import { SelectMemberComponent } from "../../../../shared/ui-components/molecules/select-member/select-member.component";

@Component({
  selector: "app-schedule-session-popup",
  imports: [
    FormsModule,

    MatDivider,
    MatDialogModule,
    MatButtonModule,
    TranslocoDirective,

    SelectMemberComponent,
  ],
  templateUrl: "./schedule-session-popup.component.html",
  styleUrl: "./schedule-session-popup.component.scss",
})
export class ScheduleSessionPopupComponent {
  userService = inject(UserService);
  branchService = inject(BranchesService);
  dialogRef = inject(MatDialogRef);
  snackBar = inject(SnackbarService);
  private bookedSessionsService = inject(BookedSessionsService);

  public selectedSession: ScheduleSession = inject(MAT_DIALOG_DATA);

  selectedMember = signal<MemberAccount | null>(null);

  translationTemplate: TranslationTemplates =
    TranslationTemplates.SCHEDULEDSESSION;
  constructor() {
  }

  scheduleSession() {
    // this.loading.set(true);
    const userMembership = this.selectedMember()
      ?.UserMembership as UserMembership;
    const scheduledSession: UserSessionInsert = {
      branchId: this.branchService.currentBranch?.id || "",
      scheduledSessionId: this.selectedSession.id,
      userMemberShipId: userMembership.id || "",
    };
    this.bookedSessionsService
      .bookSession(scheduledSession, userMembership.id)
      .subscribe({
        next: (res) => {
          console.log(res);
          this.snackBar.success("SESSION_BOOK_SUCCESSFULLY");
          this.dialogRef.close(true);
        },
        error: (err) => {
          this.snackBar.error(err.message || "Something went wrong");
        },
      });
  }
  setMember(member: MemberAccount) {
    this.selectedMember.set(member);
  }
}
