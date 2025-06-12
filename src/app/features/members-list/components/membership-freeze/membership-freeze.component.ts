import { Component, inject, model } from "@angular/core";
import { MatCardModule } from "@angular/material/card";
import {
  MAT_DIALOG_DATA,
  MatDialogModule,
  MatDialogRef,
} from "@angular/material/dialog";
import { TranslocoDirective } from "@jsverse/transloco";
import { TranslationTemplates } from "../../../../shared/enums/translation-templates-enum";
import { MatButtonModule } from "@angular/material/button";
import { UserMembership } from "../../models/member";
import { DatePickerComponent } from "../../../../shared/ui-components/atoms/date-picker/date-picker.component";
import { FormsModule } from "@angular/forms";
import { UserMembershipService } from "../../services/user-membership.service";
import { SnackbarService } from "../../../../core/services/snackbar/snackbar.service";
import { UserService } from "../../../../core/services/user/user.service";
import { InputComponent } from "../../../../shared/ui-components/atoms/input/input.component";

@Component({
  selector: "app-membership-freeze",
  imports: [
    MatDialogModule,
    TranslocoDirective,
    MatCardModule,
    MatButtonModule,
    DatePickerComponent,
    FormsModule,
    InputComponent,
  ],
  templateUrl: "./membership-freeze.component.html",
  styleUrl: "./membership-freeze.component.scss",
})
export class MembershipFreezeComponent {
  translationTemplate = TranslationTemplates.MEMBER;
  readonly dialogRef = inject(MatDialogRef<MembershipFreezeComponent>);
  readonly data = inject<any>(MAT_DIALOG_DATA);
  private userMembershipService = inject(UserMembershipService);
  private userService = inject(UserService);
  private snackbarService = inject(SnackbarService);
  readonly membership = model<UserMembership>(
    structuredClone(this.data.membership),
  );
  freezeData: { freezeDaysCount: number; freezeStart: Date } = {} as any;
  maxFreezeDaysCount: number | null = null;
  constructor() {
    if (this.userService.currentUser?.role !== "SuperAdmin") {
      this.maxFreezeDaysCount = this.data.membership.remainingFreezePeriod;
    }
  }
  // freeze() {
  //   const membership = structuredClone(this.membership());
  //   delete (membership as any)?.Members;
  //   delete (membership as any)?.salesStaff;
  //   if (membership.coach) {
  //     delete (membership as any)?.coach;
  //   }

  //   if (membership.freezeEnd && membership.freezeStart) {
  //     const now = new Date();
  //     let freezeStartDate = new Date(membership.freezeStart);

  //     // If the freeze start is in the future, adjust it to now

  //     membership.freezeEnd = new Date(membership.freezeEnd).toISOString();
  //     membership.freezeStart = freezeStartDate.toISOString();
  //     if (freezeStartDate <= now) {
  //       membership.isFreeze = true;
  //     }

  //     this.userMembershipService.updateUserMembership(membership.id, membership)
  //       .subscribe((res) => {
  //         this.snackbarService.success("FREEZE_MEMBERSHIP_SUCCESS");
  //         this.dialogRef.close(true);
  //       });
  //   }
  // }
  freeze() {
    const membership = structuredClone(this.membership());
    // Remove embedded objects that shouldn't be sent to the API
    delete (membership as any)?.Members;
    delete (membership as any)?.salesStaff;
    // if (membership.coach) {
    delete (membership as any)?.coach;
    // }

    // Expect membership.freezeStart and membership.freezeDaysCount to be provided.
    if (
      this.freezeData.freezeStart &&
      this.freezeData.freezeDaysCount &&
      (!this.maxFreezeDaysCount ||
        this.freezeData.freezeDaysCount <= this.maxFreezeDaysCount)
    )  
    
    
    {
      const now = new Date();
      const freezeStartDate = this.freezeData.freezeStart;


      // Calculate freezeEnd by adding freezeDaysCount days to freezeStartDate.
      const freezeEndDate = new Date(
        freezeStartDate.getTime() +
          this.freezeData.freezeDaysCount * 24 * 60 * 60 * 1000,
      );

      // Update membership object with computed values.
      membership.freezeStart = freezeStartDate.toISOString();
      membership.freezeEnd = freezeEndDate.toISOString();
      membership.isFreeze = freezeStartDate <= now;

      this.userMembershipService.updateUserMembership(membership.id, membership)
        .subscribe((res) => {
          this.snackbarService.success("FREEZE_MEMBERSHIP_SUCCESS");
          this.dialogRef.close(true);
        });
    }
  }
}
