import { AsyncPipe, JsonPipe } from "@angular/common";
import { Component, inject, signal, viewChild } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { MatButtonModule } from "@angular/material/button";
import { MatCardModule } from "@angular/material/card";
import { MatDivider } from "@angular/material/divider";
import { MatIcon } from "@angular/material/icon";
import { Router, RouterLink } from "@angular/router";
import { TranslocoDirective } from "@jsverse/transloco";
import { APP_ROUTES } from "../../../../core/enums/pages-urls-enum";
import { LookupService } from "../../../../core/services/lookup/lookup.service";
import { SnackbarService } from "../../../../core/services/snackbar/snackbar.service";
import { TranslationTemplates } from "../../../../shared/enums/translation-templates-enum";
import { BridgesInputType } from "../../../../shared/ui-components/atoms/input/enum/bridges-input-type.enum";
import { InputComponent } from "../../../../shared/ui-components/atoms/input/input.component";
import { SelectComponent } from "../../../../shared/ui-components/atoms/select/select.component";
import { ConfirmPasswordComponent } from "../../../../shared/ui-components/organisms/confirm-password/confirm-password.component";
import { MemberAccount, UserMembership } from "../../models/member";
import { MemberService } from "../../services/member.service";
import { DatePickerComponent } from "../../../../shared/ui-components/atoms/date-picker/date-picker.component";
import { MatStepper, MatStepperModule } from "@angular/material/stepper";
import { BreakpointObserver } from "@angular/cdk/layout";
import { map } from "rxjs";
import { Memberships } from "../../../membership-list/models/membership";
import { MembershipService } from "../../../membership-list/services/membership.service";
import { SelectMembershipComponent } from "../../../../shared/ui-components/molecules/select-membership/select-membership.component";
import { BranchesService } from "../../../../core/services/branches/branches.service";
import { UserService } from "../../../../core/services/user/user.service";
import { UserMembershipService } from "../../services/user-membership.service";

@Component({
  selector: "app-add-member",
  imports: [
    FormsModule,
    MatIcon,
    MatDivider,
    MatCardModule,
    RouterLink,
    InputComponent,
    TranslocoDirective,
    MatButtonModule,
    AsyncPipe,
    ConfirmPasswordComponent,
    DatePickerComponent,
    MatStepperModule,

    SelectMembershipComponent,
  ],
  templateUrl: "./add-member.component.html",
  styleUrl: "./add-member.component.scss",
})
export class AddMemberComponent {
  translationTemplate = TranslationTemplates.MEMBER;
  APP_ROUTES = APP_ROUTES;
  private memberService = inject(MemberService);
  private snackbarService = inject(SnackbarService);

  userService = inject(UserService);
  lookupService = inject(LookupService);
  breakpointObserver = inject(BreakpointObserver);
  branchesService = inject(BranchesService);
  userMembershipService = inject(UserMembershipService);
  private router = inject(Router);
  stepper = viewChild(MatStepper);

  member = signal(new MemberAccount());
  userMemberships = signal<UserMembership[]>([
    new UserMembership("87b36464-9443-4025-9c5d-6c0d3aebfd34"),
  ]);
  bridgesInputType = BridgesInputType;

  stepperOrientation$ = this.breakpointObserver
    .observe("(min-width: 800px)")
    .pipe(map(({ matches }) => (matches ? "horizontal" : "vertical")));
  nationalIdRegExp = /^(2|3)\d{2}(0[1-9]|1[0-2])(0[1-9]|[12]\d|3[01])\d{7}$/;
  userId = signal<string | null>(null);

  constructor() {}
  ngOnInit(): void {}

  addMember() {
    this.memberService
      .createMember(this.member())
      .subscribe((res) => {
        if (!res.error) {
          this.getMemer(res.data.user_id);

          this.snackbarService.success("ADD_Member_SUCCESS");
        }
      });
  }
  getMemer(id: string) {
    this.memberService.getMember(id).subscribe((res) => {
      console.log(res);

      this.member.update((m) => {
        return { ...m, ...res };
      });
      setTimeout(() => {
        this.stepper()?.next();
      });
    });
  }
  addMemberships() {
    this.userMembershipService.createUserMembership(this.userMemberships()[0])
      .subscribe((res) => {
        console.log(res);
      });
  }

  setMembership(index: number, e: Memberships) {
    const membership = this.createUserMembershipFromMembership(e, {
      branchId: this.branchesService.currentBranch?.id as any,
      staffId: this.userService.currentUser?.id as any,
      memberId: this.member().id,
    }) as any;
    console.log(membership);

    this.userMemberships.update((m) => {
      m[index] = { ...membership };
      return [...m];
    });
  }
  setBirthDate(account: MemberAccount, nationalId: any) {
    if (nationalId.length !== 14 || !this.nationalIdRegExp.test(nationalId)) {
      account.dateOfBirth = null as any;
      return;
    }
    const yearMI = nationalId.slice(0, 1);
    const year = nationalId.slice(1, 3);
    const month = nationalId.slice(3, 5);
    const day = nationalId.slice(5, 7);
    account.dateOfBirth = `${
      yearMI === "2" ? "19" : "20"
    }${year}-${month}-${day}`;
  }

  createUserMembershipFromMembership(
    membership: Memberships,
    extra: {
      branchId: string;
      staffId: string;
      memberId: string;
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
