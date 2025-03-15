import { Component, inject, input, model, output, signal } from "@angular/core";
import { TranslationTemplates } from "../../../enums/translation-templates-enum";
import { BranchesService } from "../../../../core/services/branches/branches.service";
import { SelectComponent } from "../../atoms/select/select.component";
import { filter, Subject, takeUntil } from "rxjs";
import { TranslocoDirective } from "@jsverse/transloco";
import { SessionService } from "../../../../features/sessions-list/services/session.service";
import { Sessions } from "../../../../features/sessions-list/models/sessions";

@Component({
  selector: "app-select-sessions",
  imports: [SelectComponent, TranslocoDirective],
  templateUrl: "./select-sessions.component.html",
  styleUrl: "./select-sessions.component.scss",
})
export class SelectSessionsComponent {
  translationTemplate = input.required<TranslationTemplates>();
  id = model.required<string>();
  isRequired = input(true);
  addAllOption = input(false);
  sessionsService = inject(SessionService);
  branchesService = inject(BranchesService);
  private destroyed$ = new Subject<void>();
  sessionsOptions = signal<
    { key: string; value: string; option: Sessions }[]
  >([]);
  sessions: Sessions[] = [];

  sessionsChanged = output<Sessions>();
  constructor() {
    this.branchesService.currentBranch$
      .pipe(
        filter((branch) => !!branch),
        takeUntil(this.destroyed$),
      )
      .subscribe((branch) => {
        this.sessionsService.getAllSessions({
          branchIds: [branch.id],
        }).subscribe((res) => {
          if (res.data) {
            this.sessions = [...res.data] as any;
            const mShips = res.data.map((m: Sessions) => {
              return { key: m.name, value: m.id, option: m as Sessions };
            });
            if (this.addAllOption()) {
              mShips.unshift({ key: "ALL", value: "All" } as any);
            }
            this.sessionsOptions.set(mShips);
          }
        });
      });
  }

  membershipChange(e: any) {
    const mem = this.sessions.find((m) => m.id === e);

    if (mem) {
      this.sessionsChanged.emit(structuredClone(mem));
    }
  }
  ngOnDestroy(): void {
    this.destroyed$.next();
    this.destroyed$.complete();
  }
}
