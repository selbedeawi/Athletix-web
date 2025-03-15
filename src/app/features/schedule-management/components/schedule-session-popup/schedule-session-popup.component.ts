import { Component, inject, signal } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { ScheduleSession } from '../../models/schedule-session';
import { FormsModule } from '@angular/forms';
import { InputComponent } from '../../../../shared/ui-components/atoms/input/input.component';
import { BridgesInputType } from '../../../../shared/ui-components/atoms/input/enum/bridges-input-type.enum';
import { MatDivider } from '@angular/material/divider';
import { MatButtonModule } from '@angular/material/button';
import { MemberService } from '../../../members-list/services/member.service';
import { MemberAccount } from '../../../members-list/models/member';
import { debounce, debounceTime, finalize } from 'rxjs';

@Component({
  selector: 'app-schedule-session-popup',
  imports: [FormsModule, InputComponent, MatDivider, MatDialogModule, MatButtonModule],
  templateUrl: './schedule-session-popup.component.html',
  styleUrl: './schedule-session-popup.component.scss'
})
export class ScheduleSessionPopupComponent {
  memberService = inject(MemberService);

  public selectedSession: ScheduleSession = inject(MAT_DIALOG_DATA);
  loading = signal(false);
  members = signal<MemberAccount[]>([]);

  filters: {
    searchQuery: string;
    branchId: string;
  } = {
      searchQuery: '',
      branchId: "",
    };
  bridgesInputType = BridgesInputType

  constructor() {
    console.log(this.selectedSession)
  }

  getAll() {
    // if (this.filters.searchQuery.length > 3) {

    this.loading.set(true);
    this.memberService.getAllMembers(
      this.filters
    )
      .pipe(finalize(() => this.loading.set(false)), debounceTime(250))
      .subscribe((res) => {
        if (res.data) {
          this.members.set(res.data);
          console.log(this.members())
        }
      });
    // }
  }
}
