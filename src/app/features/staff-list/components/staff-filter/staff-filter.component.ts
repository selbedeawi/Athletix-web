import { Component, inject, signal } from "@angular/core";
import { StaffAccount } from "../../models/staff";
import { BridgesInputType } from "../../../../shared/ui-components/atoms/input/enum/bridges-input-type.enum";
import { StaffService } from "../../services/staff.service";
import { TranslationTemplates } from "../../../../shared/enums/translation-templates-enum";
import { finalize } from "rxjs";
import { InputComponent } from "../../../../shared/ui-components/atoms/input/input.component";
import { SelectComponent } from "../../../../shared/ui-components/atoms/select/select.component";
import { FormsModule } from "@angular/forms";
import { TranslocoDirective } from "@jsverse/transloco";
import { MatButtonModule } from "@angular/material/button";
import { LookupService } from "../../../../core/services/lookup/lookup.service";
import { AsyncPipe } from "@angular/common";
import { AccountType } from "../../../../core/enums/account-type-enum";

@Component({
  selector: "app-staff-filter",
  imports: [
    InputComponent,
    SelectComponent,
    FormsModule,
    TranslocoDirective,
    MatButtonModule,
    AsyncPipe,
  ],
  templateUrl: "./staff-filter.component.html",
  styleUrl: "./staff-filter.component.scss",
})
export class StaffFilterComponent {
  translationTemplate: TranslationTemplates = TranslationTemplates.STAFF;

  private staffService = inject(StaffService);
  lookupService = inject(LookupService);

  filter: {
    name?: string;
    isActive?: boolean | "All";
    role?: AccountType | null;
    branchIds?: string[];
  } = {
    name: "",
    isActive: "All",
    role: null,
    branchIds: [],
  };

  bridgesInputType = BridgesInputType;

  loading = signal(false);
  staff = signal<StaffAccount[]>([]);

  pageSize = signal(10);
  pageNumber = signal(1);
  originalCount = signal(0);
  statusOptions = [
    { key: "ALL", value: "All" },
    { key: "ACTIVE", value: true },
    { key: "INACTIVE", value: false },
  ] as any;
  constructor() {
    this.getAll();
  }

  getAll() {
    this.loading.set(true);

    this.staffService
      .getAllStaff(this.filter, this.pageNumber(), this.pageSize())
      .pipe(finalize(() => this.loading.set(false)))
      .subscribe((res) => {


        this.staff.set(res.data);
        this.originalCount.set(res.count || res.data.length);
      });
  }

  reset() {
    this.filter = {
      name: "",
      isActive: "All",
      role: null,
      branchIds: [],
    };
    this.search();
  }

  search() {
    this.pageNumber.set(1);
    this.getAll();
  }
}
