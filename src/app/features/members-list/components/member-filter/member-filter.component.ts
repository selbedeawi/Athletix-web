import { MemberService } from "./../../services/member.service";
import { Component, inject, signal } from "@angular/core";
import { InputComponent } from "../../../../shared/ui-components/atoms/input/input.component";
import { SelectComponent } from "../../../../shared/ui-components/atoms/select/select.component";
import { finalize } from "rxjs";
import { TranslationTemplates } from "../../../../shared/enums/translation-templates-enum";
import { BridgesInputType } from "../../../../shared/ui-components/atoms/input/enum/bridges-input-type.enum";
import { FormsModule } from "@angular/forms";
import { MatButtonModule } from "@angular/material/button";
import { TranslocoDirective } from "@jsverse/transloco";
import { SelectMembershipComponent } from "../../../../shared/ui-components/molecules/select-membership/select-membership.component";
import { DatePickerComponent } from "../../../../shared/ui-components/atoms/date-picker/date-picker.component";
import { AllMembersFilter, MemberAccount } from "../../models/member";

@Component({
  selector: "app-member-filter",
  imports: [
    InputComponent,
    SelectComponent,
    FormsModule,
    TranslocoDirective,
    MatButtonModule,
    SelectMembershipComponent,
    DatePickerComponent,
  ],
  templateUrl: "./member-filter.component.html",
  styleUrl: "./member-filter.component.scss",
})
export class MemberFilterComponent {
  translationTemplate: TranslationTemplates = TranslationTemplates.MEMBERSHIP;
  memberService = inject(MemberService);
  filters: AllMembersFilter = {
    membershipId: "",
    isActive: true,
    isCanceled: false,
  };

  bridgesInputType = BridgesInputType;

  loading = signal(false);
  members = signal<MemberAccount[]>([]);
  pageSize = signal(10);
  pageNumber = signal(1);
  originalCount = signal(0);
  constructor() {
    this.getAll();
  }

  getAll() {
    this.loading.set(true);
    this.memberService.getAllMembers(
      this.filters,
      this.pageNumber(),
      this.pageSize(),
    )
      .pipe(finalize(() => this.loading.set(false)))
      .subscribe((res) => {
        if (res.data) {
          this.members.set(res.data);

          this.originalCount.set((res as any).count || res.data?.length);
        }
      });
  }

  reset() {
    this.filters = {
      membershipId: "",
    };
    this.search();
  }

  search() {
    this.pageNumber.set(1);
    this.getAll();
  }
}
