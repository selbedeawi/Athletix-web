import { Component, inject, input, model } from "@angular/core";
import {
  MAT_DIALOG_DATA,
  MatDialogModule,
  MatDialogRef,
} from "@angular/material/dialog";
import { SnackbarService } from "../../../../core/services/snackbar/snackbar.service";
import { TranslationTemplates } from "../../../../shared/enums/translation-templates-enum";
import { UserMembership } from "../../models/member";
import { UserMembershipService } from "../../services/user-membership.service";
import { MembershipFreezeComponent } from "../membership-freeze/membership-freeze.component";
import { FormsModule } from "@angular/forms";
import { MatButtonModule } from "@angular/material/button";
import { TranslocoDirective } from "@jsverse/transloco";
import { MemberMembershipFormComponent } from "../member-membership-form/member-membership-form.component";

@Component({
  selector: "app-add-membership-popup",
  imports: [
    MatDialogModule,
    TranslocoDirective,
    FormsModule,
    MatButtonModule,
    MemberMembershipFormComponent,
  ],
  templateUrl: "./add-membership-popup.component.html",
  styleUrl: "./add-membership-popup.component.scss",
})
export class AddMembershipPopupComponent {
  translationTemplate = TranslationTemplates.MEMBER;
  readonly dialogRef = inject(MatDialogRef<MembershipFreezeComponent>);
  readonly data = inject<any>(MAT_DIALOG_DATA);
  private userMembershipService = inject(UserMembershipService);
  private snackbarService = inject(SnackbarService);
  readonly membership = model<UserMembership>(
    structuredClone(this.data.membership),
  );
  readonly memberId = input<string>(
    this.data.memberId,
  );
  constructor() {
  }
  addMembership() {
    const membership = this.membership();
    membership.memberId = this.memberId();
    this.userMembershipService.createUserMembership(membership)
      .subscribe((res) => {
        if (!res.error) {
          this.snackbarService.success("NEW_MEMBERSHIP_ADDED_SUCCESS");
          this.dialogRef.close(true);
        }
      });
  }
}
