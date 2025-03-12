import { Component, inject, input, model } from "@angular/core";
import { SelectMembershipComponent } from "../../../../shared/ui-components/molecules/select-membership/select-membership.component";
import { InputComponent } from "../../../../shared/ui-components/atoms/input/input.component";
import { UserMembership } from "../../models/member";
import { TranslationTemplates } from "../../../../shared/enums/translation-templates-enum";
import { BridgesInputType } from "../../../../shared/ui-components/atoms/input/enum/bridges-input-type.enum";
import { Memberships } from "../../../membership-list/models/membership";
import { BranchesService } from "../../../../core/services/branches/branches.service";
import { UserService } from "../../../../core/services/user/user.service";
import { TranslocoDirective } from "@jsverse/transloco";

@Component({
  selector: "app-member-membership-form",
  imports: [SelectMembershipComponent, InputComponent, TranslocoDirective],
  templateUrl: "./member-membership-form.component.html",
  styleUrl: "./member-membership-form.component.scss",
})
export class MemberMembershipFormComponent {
  membership = model.required<UserMembership>();
  translationTemplate = input.required<TranslationTemplates>();
  bridgesInputType = BridgesInputType;
  branchesService = inject(BranchesService);
  userService = inject(UserService);

  setMembership(e: Memberships) {
    const membership = this.createUserMembershipFromMembership(e, {
      branchId: this.branchesService.currentBranch?.id as any,
      staffId: this.userService.currentUser?.id as any,
    }) as any;

    this.membership.update((m) => {
      Object.assign(m, membership);
      return m;
    });
  }

  createUserMembershipFromMembership(
    membership: Memberships,
    extra: {
      branchId: string;
      staffId: string;
      memberId?: string;
      coachId?: string | null;
      salesId?: string | null;
    },
  ): Partial<UserMembership> {
    const start = new Date();
    const endDate = new Date(
      start.getTime() + membership.durationInDays * 24 * 60 * 60 * 1000,
    ).toISOString();
    const now = new Date().toISOString();

    return {
      branchId: extra.branchId,
      coachId: extra.coachId ?? null,
      createdAt: now,
      modifiedAt: now,

      endDate: endDate,
      freezePeriod: membership.freezePeriod,

      hasGroupFitness: membership.hasGroupFitness ?? false,
      hasJacuzzi: membership.hasJacuzzi ?? false,
      hasSteam: membership.hasSteam ?? false,
      hasSunna: membership.hasSunna ?? false,

      isActive: true,
      memberId: extra.memberId,

      membershipId: membership.id,

      createdBy: extra.staffId,
      modifiedBy: extra.staffId,
      name: membership.name,

      numberOfInBody: membership.inBodyCount ?? 0,
      numberOfInvitations: membership.numberOfInvitations ?? 0,
      numberOfPersonalTrainer: membership.personalTrainerCount ?? 0,
      numberOfSessions: membership.numberOfSessions ?? null,
      numberOfVisits: membership.numberOfVisits ?? 0,

      pricePaid: membership.amountAfterDiscount,

      remainingFreezePeriod: membership.freezePeriod,
      remainingGroupSessions: membership.numberOfSessions ?? null,
      remainingInBody: membership.inBodyCount ?? 0,
      remainingInvitations: membership.numberOfInvitations ?? 0,
      remainingPersonalTrainer: membership.personalTrainerCount ?? 0,
      remainingPTSessions: membership.numberOfSessions ?? null,
      remainingVisits: membership.numberOfVisits ?? 0,
      salesId: extra.salesId ?? null,
      startDate: now,
      type: membership.type,
    };
  }
}
