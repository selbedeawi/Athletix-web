import { Component, inject, input, OnInit, signal } from "@angular/core";
import { MemberFormComponent } from "../member-form/member-form.component";
import { TranslationTemplates } from "../../../../shared/enums/translation-templates-enum";
import { MemberService } from "../../services/member.service";
import { MemberAccount } from "../../models/member";
import { SnackbarService } from "../../../../core/services/snackbar/snackbar.service";
import { FormsModule } from "@angular/forms";
import { TranslocoDirective } from "@jsverse/transloco";
import { MatButton } from "@angular/material/button";

@Component({
  selector: "app-member-profile",
  imports: [MemberFormComponent, FormsModule, TranslocoDirective, MatButton],
  templateUrl: "./member-profile.component.html",
  styleUrl: "./member-profile.component.scss",
})
export class MemberProfileComponent implements OnInit {
  translationTemplate = TranslationTemplates.MEMBER;
  id = input.required<string>();
  member = signal(new MemberAccount());
  private memberService = inject(MemberService);
  private snackbarService = inject(SnackbarService);
  // nationalIdRegExp = /^(2|3)\d{2}(0[1-9]|1[0-2])(0[1-9]|[12]\d|3[01])\d{7}$/;

  ngOnInit(): void {
    this.memberService.getMember(this.id()).subscribe((res) => {
      this.member.set(res);
    });
  }
  update() {
    this.memberService.updateMember(this.id(), this.member()).subscribe(() => {
      this.snackbarService.success(`UPDATE_MEMBER_SUCCESS`);
    });
  }
  // setBirthDate(account: MemberAccount, nationalId: any) {
  //   if (nationalId.length !== 14 || !this.nationalIdRegExp.test(nationalId)) {
  //     account.dateOfBirth = null as any;
  //     return;
  //   }
  //   const yearMI = nationalId.slice(0, 1);
  //   const year = nationalId.slice(1, 3);
  //   const month = nationalId.slice(3, 5);
  //   const day = nationalId.slice(5, 7);
  //   account.dateOfBirth = `${
  //     yearMI === "2" ? "19" : "20"
  //   }${year}-${month}-${day}`;
  // }
}
