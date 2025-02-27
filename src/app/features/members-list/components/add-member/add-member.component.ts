import { AsyncPipe } from "@angular/common";
import { Component, inject, signal } from "@angular/core";
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
import { MemberAccount } from "../../models/member";
import { MemberService } from "../../services/member.service";
import { DatePickerComponent } from "../../../../shared/ui-components/atoms/date-picker/date-picker.component";
import { MatStepperModule } from "@angular/material/stepper";
import { BreakpointObserver } from "@angular/cdk/layout";
import { map } from "rxjs";

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
    // SelectComponent,
    AsyncPipe,
    ConfirmPasswordComponent,
    DatePickerComponent,
    MatStepperModule,
  ],
  templateUrl: "./add-member.component.html",
  styleUrl: "./add-member.component.scss",
})
export class AddMemberComponent {
  translationTemplate = TranslationTemplates.MEMBER;
  APP_ROUTES = APP_ROUTES;
  private memberService = inject(MemberService);
  private snackbarService = inject(SnackbarService);
  private router = inject(Router);
  member = signal(new MemberAccount());
  bridgesInputType = BridgesInputType;
  lookupService = inject(LookupService);
  breakpointObserver = inject(BreakpointObserver);

  stepperOrientation$ = this.breakpointObserver
    .observe("(min-width: 800px)")
    .pipe(map(({ matches }) => (matches ? "horizontal" : "vertical")));
  nationalIdRegExp = /^(2|3)\d{2}(0[1-9]|1[0-2])(0[1-9]|[12]\d|3[01])\d{7}$/;

  constructor() {}
  ngOnInit(): void {}

  addMember() {
    this.memberService
      .createMember(this.member())
      .subscribe((res) => {
        if (!res.error) {
          this.snackbarService.success("ADD_STAFF_SUCCESS");
          this.router.navigate([
            "/",
            APP_ROUTES.STAFF_LIST,
          ]);
        }
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
}
