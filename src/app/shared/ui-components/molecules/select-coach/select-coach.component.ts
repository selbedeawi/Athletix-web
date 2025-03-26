import { Component, inject, input, model, signal } from "@angular/core";
import { filter, Subject, takeUntil } from "rxjs";
import { StaffService } from "../../../../features/staff-list/services/staff.service";
import { SelectComponent } from "../../atoms/select/select.component";
import { BranchesService } from "../../../../core/services/branches/branches.service";

import { TranslationTemplates } from "../../../enums/translation-templates-enum";

@Component({
  selector: "app-select-coach",
  imports: [SelectComponent],
  templateUrl: "./select-coach.component.html",
  styleUrl: "./select-coach.component.scss",
})
export class SelectCoachComponent {
  private staffService = inject(StaffService);
  private destroyed$ = new Subject<void>();
  branchesService = inject(BranchesService);
  branchId!: string;
  coachId = model.required();
  translationTemplate = input.required<TranslationTemplates>();
  isRequired = input(false);
  isMultiple = input(false);
  label = input("SELECT_COACH");

  coachOptions = signal<{ key: string; value: string }[]>([]);
  constructor() {
    this.branchesService.currentBranch$
      .pipe(
        filter((branch) => !!branch),
        takeUntil(this.destroyed$),
      )
      .subscribe((branch) => {
        this.branchId = branch.id;

        this.getAllCoaches();
      });
  }

  getAllCoaches(): void {
    this.staffService.getAllStaff(
      {
        role: "Coach",
        isActive: true,
        branchIds: [this.branchId],
      },
      1,
      100,
    )
      .subscribe((res) => {
        if (res.data && Array.isArray(res.data)) {
          this.coachOptions.set(
            res.data.map((c) => ({
              key: `${c.firstName} ${c.lastName}`,
              value: c.id,
            })),
          );
        } else {
          this.coachOptions.set([]);
        }
      });
  }
}
