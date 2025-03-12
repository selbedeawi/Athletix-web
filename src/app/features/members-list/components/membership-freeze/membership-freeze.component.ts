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

@Component({
  selector: "app-membership-freeze",
  imports: [
    MatDialogModule,
    TranslocoDirective,
    MatCardModule,
    MatButtonModule,
    DatePickerComponent,
    FormsModule,
  ],
  templateUrl: "./membership-freeze.component.html",
  styleUrl: "./membership-freeze.component.scss",
})
export class MembershipFreezeComponent {
  translationTemplate = TranslationTemplates.MEMBER;
  readonly dialogRef = inject(MatDialogRef<MembershipFreezeComponent>);
  readonly data = inject<any>(MAT_DIALOG_DATA);
  private userMembershipService = inject(UserMembershipService);
  private snackbarService = inject(SnackbarService);
  readonly membership = model<UserMembership>(
    structuredClone(this.data.membership),
  );

  constructor() {}
  freeze() {
    const membership = structuredClone(this.membership());
    delete (membership as any)?.Members;
    if (membership.freezeEnd && membership.freezeStart) {
      const now = new Date();
      let freezeStartDate = new Date(membership.freezeStart);

      // If the freeze start is in the future, adjust it to now

      membership.freezeEnd = new Date(membership.freezeEnd).toISOString();
      membership.freezeStart = freezeStartDate.toISOString();
      if (freezeStartDate <= now) {
        membership.isFreeze = true;
      }

      this.userMembershipService.updateUserMembership(membership.id, membership)
        .subscribe((res) => {
          this.snackbarService.success("FREEZE_MEMBERSHIP_SUCCESS");
          this.dialogRef.close(true);
        });
    }
  }
}
