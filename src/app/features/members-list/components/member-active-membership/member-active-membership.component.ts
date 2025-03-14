import { Component, inject, input, OnInit, signal } from "@angular/core";
import { UserMembershipService } from "../../services/user-membership.service";
import { UserMembership } from "../../models/member";
import { TranslocoDirective } from "@jsverse/transloco";
import { MatCardModule } from "@angular/material/card";
import { TranslationTemplates } from "../../../../shared/enums/translation-templates-enum";
import { CurrencyPipe } from "@angular/common";
import { MatButtonModule } from "@angular/material/button";
import { MatDialog } from "@angular/material/dialog";
import { MembershipFreezeComponent } from "../membership-freeze/membership-freeze.component";
import { SnackbarService } from "../../../../core/services/snackbar/snackbar.service";

@Component({
  selector: "app-member-active-membership",
  imports: [TranslocoDirective, MatCardModule, CurrencyPipe, MatButtonModule],
  templateUrl: "./member-active-membership.component.html",
  styleUrl: "./member-active-membership.component.scss",
})
export class MemberActiveMembershipComponent implements OnInit {
  translationTemplate = TranslationTemplates.MEMBER;
  readonly dialog = inject(MatDialog);
  private userMembershipService = inject(UserMembershipService);
  private snackbarService = inject(SnackbarService);

  id = input.required<string>();
  userMembership = signal<UserMembership[]>([]);

  ngOnInit(): void {
    this.getUserMembership();
  }
  getUserMembership() {
    this.userMembershipService.getMembershipByUserId(this.id(), true)
      .subscribe((res) => {
        if (res) {
          this.userMembership.set(res as any);
        }
      });
  }
  freeze(membership: UserMembership) {
    this.dialog.open(MembershipFreezeComponent, {
      data: { membership },
      width: "70vw",
      minWidth: "650px",
    })
      .afterClosed()
      .subscribe(
        (res) => {
          if (res) {
            this.getUserMembership();
          }
        },
      );
  }
  addMembership() {
  }
  unFreeze(m: UserMembership) {
    const membership = structuredClone(m);
    const now = new Date();
    delete (membership as any)?.Members;

    if (membership.freezeStart && membership.remainingFreezePeriod) {
      const freezeStartDate = new Date(membership.freezeStart);
      // Calculate elapsed freeze time in whole days
      const elapsedDays = freezeStartDate > now ? 0 : Math.floor(
        (now.getTime() - freezeStartDate.getTime()) / (24 * 60 * 60 * 1000),
      );

      // Use the current remainingFreezePeriod if already partially used,
      // otherwise use the full freezePeriod.
      const currentRemaining = membership.remainingFreezePeriod;
      const newRemaining = currentRemaining - elapsedDays;
      membership.remainingFreezePeriod = newRemaining > 0 ? newRemaining : 0;

      // Clear freeze fields
      membership.isFreeze = false;
      membership.freezeStart = null;
      membership.freezeEnd = null;

      this.userMembershipService.updateUserMembership(membership.id, membership)
        .subscribe((res) => {
          if (res) {
            this.snackbarService.success("UNFREEZE_MEMBERSHIP_SUCCESS");
            this.getUserMembership();
          }
        });
    }
  }
  renew() {}
  cancel() {}
}
