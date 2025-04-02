import { AsyncPipe } from "@angular/common";
import { Component, inject, signal, viewChild } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { MatButtonModule } from "@angular/material/button";
import { MatCardModule } from "@angular/material/card";
import { MatDivider } from "@angular/material/divider";
import { MatIcon } from "@angular/material/icon";
import { Router, RouterLink } from "@angular/router";
import { TranslocoDirective } from "@jsverse/transloco";
import { APP_ROUTES } from "../../../../core/enums/pages-urls-enum";
import { SnackbarService } from "../../../../core/services/snackbar/snackbar.service";
import { TranslationTemplates } from "../../../../shared/enums/translation-templates-enum";
import { MemberAccount, UserMembership } from "../../models/member";
import { MemberService } from "../../services/member.service";
import { MatStepper, MatStepperModule } from "@angular/material/stepper";
import { BreakpointObserver } from "@angular/cdk/layout";
import { forkJoin, map, switchMap, throwError } from "rxjs";
import { UserMembershipService } from "../../services/user-membership.service";
import { MemberFormComponent } from "../member-form/member-form.component";
import { MemberMembershipFormComponent } from "../member-membership-form/member-membership-form.component";

@Component({
  selector: "app-add-member",
  imports: [
    FormsModule,
    MatIcon,
    MatDivider,
    MatCardModule,
    RouterLink,
    TranslocoDirective,
    MatButtonModule,
    AsyncPipe,
    MatStepperModule,
    MemberFormComponent,
    MemberMembershipFormComponent,
  ],
  templateUrl: "./add-member.component.html",
  styleUrl: "./add-member.component.scss",
})
export class AddMemberComponent {
  translationTemplate = TranslationTemplates.MEMBER;
  APP_ROUTES = APP_ROUTES;

  private memberService = inject(MemberService);
  private snackbarService = inject(SnackbarService);
  private breakpointObserver = inject(BreakpointObserver);
  private userMembershipService = inject(UserMembershipService);
  private router = inject(Router);

  stepper = viewChild(MatStepper);

  member = signal(new MemberAccount());
  userMemberships = signal<UserMembership[]>([
    new UserMembership(),
  ]);

  stepperOrientation$ = this.breakpointObserver
    .observe("(min-width: 800px)")
    .pipe(map(({ matches }) => (matches ? "horizontal" : "vertical")));

  constructor() {}
  ngOnInit(): void {}

  finalizeRegistration() {
    const clone = structuredClone(this.member());
    clone.password = this.generateRandomPassword(
      clone.firstName,
      clone.lastName,
    );

    this.memberService
      .createMember(clone)
      .pipe(
        switchMap((memberRes) => {
          if (memberRes.error) {
            return throwError(() => new Error("Error creating member"));
          }

          this.snackbarService.success("ADD_MEMBER_SUCCESS");

          const memberId = memberRes.data.user_id;

          this.userMemberships.update((memberships) =>
            memberships.map((m) => ({ ...m, memberId }))
          );

          const membershipCalls = this.userMemberships().map((m) =>
            this.userMembershipService.createUserMembership(m)
          );
          return forkJoin(membershipCalls);
        }),
      )
      .subscribe({
        next: (membershipsRes) => {
          this.router.navigate(["/", APP_ROUTES.MEMBERS_LIST]);
        },
        error: (err) => {
          console.error("Error during registration:", err);
          // Handle errors appropriately.
        },
      });
  }

  addMemberships() {
    this.userMemberships.update((m) => {
      return [...m, new UserMembership()];
    });
  }
  removeMemberships(i: number) {
    this.userMemberships()?.splice(i, 1);
  }

  generateRandomPassword(
    first: string,
    last: string,
    length: number = 6,
  ): string {
    // Ensure length is within bounds.
    length = Math.max(8, Math.min(36, length));

    const digits = "0123456789";

    // Combine allowed characters (exclude space).
    const all = digits;

    // Guarantee at least one lower and one upper.
    let password = "";
    password += first.trim()[0].toUpperCase();
    password += last.trim()[0].toLowerCase();

    // Fill remaining characters.
    for (let i = 2; i < length; i++) {
      password += all[Math.floor(Math.random() * all.length)];
    }

    // Shuffle the characters to randomize positions.
    return password.split("").sort(() => 0.5 - Math.random()).join("");
  }
}
