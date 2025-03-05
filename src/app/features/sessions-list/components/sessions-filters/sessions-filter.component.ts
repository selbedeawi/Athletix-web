import { Component, inject, signal } from "@angular/core";
import { Sessions } from "../../models/sessions";
import { AsyncPipe } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { MatButtonModule } from "@angular/material/button";
import { TranslocoDirective } from "@jsverse/transloco";
import { LookupService } from "../../../../core/services/lookup/lookup.service";
import { BridgesInputType } from "../../../../shared/ui-components/atoms/input/enum/bridges-input-type.enum";
import { InputComponent } from "../../../../shared/ui-components/atoms/input/input.component";
import { SelectComponent } from "../../../../shared/ui-components/atoms/select/select.component";
import { TranslationTemplates } from "../../../../shared/enums/translation-templates-enum";
import { finalize } from "rxjs";
import { SessionService } from "../../services/session.service";

@Component({
  selector: "app-session-filter",
  imports: [
    InputComponent,
    SelectComponent,
    FormsModule,
    TranslocoDirective,
    MatButtonModule,
    AsyncPipe,
  ],
  templateUrl: "./sessions-filter.component.html",
  styleUrl: "./sessions-filter.component.scss",
})
export class SessionsFilterComponent {
  translationTemplate: TranslationTemplates = TranslationTemplates.SESSIONS;

  private sessionService = inject(SessionService);
  lookupService = inject(LookupService);

  filter: {
    name?: string;
    branchIds?: string[];
  } = {
    name: "",
    branchIds: [],
  };

  bridgesInputType = BridgesInputType;

  loading = signal(false);
  sessions = signal<Sessions[]>([]);

  pageSize = signal(10);
  pageNumber = signal(1);
  originalCount = signal(0);
  constructor() {
    this.getAll();
  }

  getAll() {
    this.loading.set(true);

    this.sessionService
      .getAllSessions(this.filter, this.pageNumber(), this.pageSize())
      .pipe(finalize(() => this.loading.set(false)))
      .subscribe((res) => {
        console.log(res);

        this.sessions.set(res.data);
        this.originalCount.set(res.count || res.data?.length);
      });
  }

  reset() {
    this.filter = {
      name: "",
      branchIds: [],
    };
    this.search();
  }

  search() {
    this.pageNumber.set(1);
    this.getAll();
  }
}
