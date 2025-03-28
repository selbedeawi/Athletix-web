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
import { SelectStaffComponent } from "../../../../shared/ui-components/molecules/select-staff/select-staff.component";
import { DatePickerComponent } from "../../../../shared/ui-components/atoms/date-picker/date-picker.component";

@Component({
  selector: "app-member-membership-form",
  imports: [
    SelectMembershipComponent,
    InputComponent,
    TranslocoDirective,
    SelectStaffComponent,
    DatePickerComponent,
  ],
  templateUrl: "./member-membership-form.component.html",
  styleUrl: "./member-membership-form.component.scss",
})
export class MemberMembershipFormComponent {
  membership = model.required<UserMembership>();
  translationTemplate = input.required<TranslationTemplates>();
  bridgesInputType = BridgesInputType;
  branchesService = inject(BranchesService);
  userService = inject(UserService);
  now: any = new Date();
  startDate: any = new Date();
  endDate: any = new Date();
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
    const { start, endDate } = this.setDates(membership.durationInDays);

    return {
      branchId: extra.branchId,
      coachId: extra.coachId ?? null,

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
      startDate: start,
      type: membership.type,
    };
  }

  setDates(durationInDays: number) {
    const start = this.formatDate(this.startDate);
    this.endDate = new Date(
      this.startDate.getTime() + durationInDays * 24 * 60 * 60 * 1000,
    );
    const endDate = this.formatDate(
      this.endDate,
    );
    this.membership().startDate = start;
    this.membership().endDate = endDate;
    return { start, endDate };
  }
  private formatDate(date: Date): string {
    const year = date.getFullYear();
    // Months are 0-based so we add 1
    const month = date.getMonth() + 1;
    const day = date.getDate();
    return `${year}-${month}-${day}`;
  }
}
