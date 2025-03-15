import { Component, inject, signal } from '@angular/core';
import { finalize } from 'rxjs';
import { BridgesInputType } from '../../../../shared/ui-components/atoms/input/enum/bridges-input-type.enum';
import {
  Memberships,
  MembershipType,
} from '../../../membership-list/models/membership';
import { TranslationTemplates } from '../../../../shared/enums/translation-templates-enum';
import { MembershipService } from '../../../membership-list/services/membership.service';
import { LookupService } from '../../../../core/services/lookup/lookup.service';
import { InputComponent } from '../../../../shared/ui-components/atoms/input/input.component';
import { SelectComponent } from '../../../../shared/ui-components/atoms/select/select.component';
import { FormsModule } from '@angular/forms';
import { TranslocoDirective } from '@jsverse/transloco';
import { MatButtonModule } from '@angular/material/button';
import { AsyncPipe } from '@angular/common';
import { DatePickerComponent } from "../../../../shared/ui-components/atoms/date-picker/date-picker.component";

@Component({
  selector: 'app-pt-sessions-fillter',
  imports: [
    InputComponent,
    SelectComponent,
    FormsModule,
    TranslocoDirective,
    MatButtonModule,
    AsyncPipe,
    DatePickerComponent
],
  templateUrl: './pt-sessions-fillter.component.html',
  styleUrl: './pt-sessions-fillter.component.scss',
})
export class PtSessionsFillterComponent {

  translationTemplate: TranslationTemplates = TranslationTemplates.BOOKED_SESSION;

  private membershipService = inject(MembershipService);
  lookupService = inject(LookupService);
  sessions = signal<any[]>([]);

  filter: {
    name?: string;
    type?: MembershipType | 'All';
    branchIds?: string[];
  } = {
    name: '',
    type: 'All',
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
    // this.filter = {
    //   name: '',
    //   type: 'All',
    //   branchIds: [],
    // };
    // this.search();
  }

  search() {
    this.pageNumber.set(1);
    this.getAll();
  }
}
