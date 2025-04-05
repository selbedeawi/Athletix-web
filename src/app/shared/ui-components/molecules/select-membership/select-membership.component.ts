import {
  Component,
  inject,
  input,
  model,
  output,
  signal,
  SimpleChanges,
} from "@angular/core";
import { TranslationTemplates } from "../../../enums/translation-templates-enum";
import { MembershipService } from "../../../../features/membership-list/services/membership.service";
import { BranchesService } from "../../../../core/services/branches/branches.service";
import { SelectComponent } from "../../atoms/select/select.component";
import { filter, Subject, takeUntil } from "rxjs";
import { Memberships } from "../../../../features/membership-list/models/membership";
import { TranslocoDirective } from "@jsverse/transloco";

@Component({
  selector: "app-select-membership",
  imports: [SelectComponent, TranslocoDirective],
  templateUrl: "./select-membership.component.html",
  styleUrl: "./select-membership.component.scss",
})
export class SelectMembershipComponent {
  translationTemplate = input.required<TranslationTemplates>();
  id = model.required<string | undefined>();
  isRequired = input(true);
  addAllOption = input(false);
  membershipService = inject(MembershipService);
  branchesService = inject(BranchesService);
  private destroyed$ = new Subject<void>();
  membershipsOptions = signal<
    { key: string; value: string; option: Memberships }[]
  >([]);
  memberships: Memberships[] = [];
  overrideBranchId = input<string | undefined>();
  membershipChanged = output<Memberships>();
  selectedMembership: Memberships | null = null;
  constructor() {
    this.branchesService.currentBranch$
      .pipe(
        filter((branch) => !!branch),
        takeUntil(this.destroyed$),
      )
      .subscribe((branch) => {
        this.getMembership(branch.id);
      });
  }
  getMembership(branchId: string) {
    this.membershipService.getAllMemberships({
      branchIds: this.overrideBranchId()
        ? [this.overrideBranchId() as any]
        : [branchId],
    }).subscribe((res) => {
      if (res.data) {
        this.memberships = [...res.data] as any;

        const mShips = res.data.map((m) => {
          return { key: m.name, value: m.id, option: m as Memberships };
        });
        if (this.addAllOption()) {
          mShips.unshift({ key: "ALL", value: "All" } as any);
        }
        this.membershipsOptions.set(mShips);
      }
    });
  }
  ngOnChanges(changes: SimpleChanges): void {
    if (changes?.["overrideBranchId"]?.currentValue) {
      this.getMembership(changes?.["overrideBranchId"].currentValue);
    }
  }
  membershipChange(e: any) {
    const mem = this.memberships.find((m) => m.id === e);

    if (mem) {
      this.selectedMembership = structuredClone(mem);
      this.membershipChanged.emit(this.selectedMembership);
    }
  }
  ngOnDestroy(): void {
    this.destroyed$.next();
    this.destroyed$.complete();
  }
}
