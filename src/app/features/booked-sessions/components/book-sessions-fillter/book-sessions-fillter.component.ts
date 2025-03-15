import { Component, inject, signal } from "@angular/core";
import { finalize } from "rxjs";
import { BridgesInputType } from "../../../../shared/ui-components/atoms/input/enum/bridges-input-type.enum";
import {
  Memberships,
  MembershipType,
} from "../../../membership-list/models/membership";
import { TranslationTemplates } from "../../../../shared/enums/translation-templates-enum";
import { MembershipService } from "../../../membership-list/services/membership.service";
import { LookupService } from "../../../../core/services/lookup/lookup.service";
import { InputComponent } from "../../../../shared/ui-components/atoms/input/input.component";
import { SelectComponent } from "../../../../shared/ui-components/atoms/select/select.component";
import { FormsModule } from "@angular/forms";
import { TranslocoDirective } from "@jsverse/transloco";
import { MatButtonModule } from "@angular/material/button";
import { AsyncPipe } from "@angular/common";
import { DatePickerComponent } from "../../../../shared/ui-components/atoms/date-picker/date-picker.component";
import {
  BookedSessionFilter,
  BookedSessionsService,
} from "../../services/booked-sessions.service";
import { BookedSessionResponse } from "../../models/session";
import { Tables } from "../../../../../../database.types";

@Component({
  selector: "app-book-sessions-fillter",
  imports: [
    InputComponent,
    SelectComponent,
    FormsModule,
    TranslocoDirective,
    MatButtonModule,
    AsyncPipe,
    DatePickerComponent,
  ],
  templateUrl: "./book-sessions-fillter.component.html",
  styleUrl: "./book-sessions-fillter.component.scss",
})
export class BookSessionsFillterComponent {
  translationTemplate: TranslationTemplates =
    TranslationTemplates.BOOKED_SESSION;

  private bookedSessionsService = inject(BookedSessionsService);
  lookupService = inject(LookupService);

  filter: BookedSessionFilter = {
    searchKey: "",
    scheduledDateFrom: undefined,
    scheduledSessionId: null,
  };
  bridgesInputType = BridgesInputType;

  loading = signal(false);
  sessions = signal<Tables<"flattened_user_sessions_full">[]>([]);

  pageSize = signal(10);
  pageNumber = signal(1);
  originalCount = signal(0);
  constructor() {
    this.getAll();
  }

  getAll() {
    this.loading.set(true);

    if (this.filter) {
      this.bookedSessionsService.filterBookedSessions(this.filter)
        .pipe(finalize(() => this.loading.set(false)))
        .subscribe((res) => {
          this.sessions.set(res);
          this.originalCount.set((res as any).count);
        });
    } else {
      this.loading.set(false);
      console.error("Filter is not properly initialized.");
    }
  }

  reset() {
    this.filter = {
      searchKey: "",
      scheduledDateFrom: null,
      scheduledSessionId: null,
    };
    console.log(this.filter);
    this.search();
  }

  search() {
    this.pageNumber.set(1);
    this.getAll();
  }
}
