import { Component, inject, signal } from "@angular/core";
import { Memberships, MembershipType } from "../../models/membership";
import { AsyncPipe } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { MatButtonModule } from "@angular/material/button";
import { TranslocoDirective } from "@jsverse/transloco";
import { LookupService } from "../../../../core/services/lookup/lookup.service";
import { BridgesInputType } from "../../../../shared/ui-components/atoms/input/enum/bridges-input-type.enum";
import { InputComponent } from "../../../../shared/ui-components/atoms/input/input.component";
import { SelectComponent } from "../../../../shared/ui-components/atoms/select/select.component";
import { MembershipService } from "../../services/membership.service";
import { TranslationTemplates } from "../../../../shared/enums/translation-templates-enum";
import { finalize } from "rxjs";

@Component({
  selector: "app-membership-filter",
  imports: [
    InputComponent,
    SelectComponent,
    FormsModule,
    TranslocoDirective,
    MatButtonModule,
    AsyncPipe,
  ],
  templateUrl: "./membership-filter.component.html",
  styleUrl: "./membership-filter.component.scss",
})
export class MembershipFilterComponent {
  translationTemplate: TranslationTemplates = TranslationTemplates.MEMBERSHIP;

  private membershipService = inject(MembershipService);
  lookupService = inject(LookupService);

  filter: {
    name?: string;
    type?: MembershipType | "All";
    branchIds?: string[];
  } = {
    name: "",
    type: "All",
    branchIds: [],
  };

  bridgesInputType = BridgesInputType;

  loading = signal(false);
  memberships = signal<Memberships[]>([]);

  pageSize = signal(10);
  pageNumber = signal(1);
  originalCount = signal(0);
  constructor() {
    this.getAll();
  }

  getAll() {
    this.loading.set(true);

    this.membershipService
      .getAllMemberships(this.filter, this.pageNumber(), this.pageSize())
      .pipe(finalize(() => this.loading.set(false)))
      .subscribe((res) => {
        if (res.data) {
          this.memberships.set(res.data as any);
          this.originalCount.set((res as any).count || res.data?.length);
        }
      });
  }

  reset() {
    this.filter = {
      name: "",
      type: "All",
      branchIds: [],
    };
    this.search();
  }

  search() {
    this.pageNumber.set(1);
    this.getAll();
  }
}
