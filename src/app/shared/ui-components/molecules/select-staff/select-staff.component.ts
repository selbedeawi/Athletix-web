import {
  Component,
  inject,
  input,
  model,
  OnInit,
  signal,
  SimpleChanges,
} from "@angular/core";
import { filter, Subject, takeUntil } from "rxjs";
import { StaffService } from "../../../../features/staff-list/services/staff.service";
import { SelectComponent } from "../../atoms/select/select.component";
import { BranchesService } from "../../../../core/services/branches/branches.service";

import { TranslationTemplates } from "../../../enums/translation-templates-enum";
import { AccountType } from "../../../../core/enums/account-type-enum";

@Component({
  selector: "app-select-staff",
  imports: [SelectComponent],
  templateUrl: "./select-staff.component.html",
  styleUrl: "./select-staff.component.scss",
})
export class SelectStaffComponent implements OnInit {
  private staffService = inject(StaffService);
  private destroyed$ = new Subject<void>();
  branchesService = inject(BranchesService);
  branchId!: string;
  staffId = model.required();
  translationTemplate = input.required<TranslationTemplates>();
  isRequired = input(false);
  isMultiple = input(false);
  role = input.required<AccountType>();
  label = input("SELECT_staff");
  overrideBranchId = input<string | undefined>();
  staffOptions = signal<{ key: string; value: string }[]>([]);
  constructor() {
  }
  ngOnInit(): void {
    this.branchesService.currentBranch$
      .pipe(
        filter((branch) => !!branch),
        takeUntil(this.destroyed$),
      )
      .subscribe((branch) => {
        this.branchId = branch.id;

        this.getAllstaffes();
      });
  }

  getAllstaffes(): void {
    this.staffService.getAllStaff(
      {
        role: this.role(),
        isActive: true,
        branchIds: this.overrideBranchId()
          ? [this.overrideBranchId() as any]
          : [this.branchId],
      },
      1,
      100,
    )
      .subscribe((res) => {
        if (res.data && Array.isArray(res.data)) {
          this.staffOptions.set(
            res.data.map((c) => ({
              key: `${c.firstName} ${c.lastName}`,
              value: c.id,
            })),
          );
        } else {
          this.staffOptions.set([]);
        }
      });
  }
  ngOnChanges(changes: SimpleChanges): void {
    if (changes?.["overrideBranchId"]?.currentValue) {
      this.getAllstaffes();
    }
  }
}
