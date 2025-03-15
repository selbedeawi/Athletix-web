import { Component, inject, signal } from '@angular/core';
import {
  MAT_DIALOG_DATA,
  MatDialogModule,
  MatDialogRef,
} from '@angular/material/dialog';
import { ScheduleSession } from '../../models/schedule-session';
import { FormsModule } from '@angular/forms';
import { InputComponent } from '../../../../shared/ui-components/atoms/input/input.component';
import { BridgesInputType } from '../../../../shared/ui-components/atoms/input/enum/bridges-input-type.enum';
import { MatDivider } from '@angular/material/divider';
import { MatButtonModule } from '@angular/material/button';
import { MemberService } from '../../../members-list/services/member.service';
import { MemberAccount } from '../../../members-list/models/member';
import { debounceTime, finalize } from 'rxjs';
import { TranslocoDirective } from '@jsverse/transloco';
import { TranslationTemplates } from '../../../../shared/enums/translation-templates-enum';
import { MatOptionModule } from '@angular/material/core';
import { ScheduledSessionService } from '../../services/schedule-sessions.service';
import { SnackbarService } from '../../../../core/services/snackbar/snackbar.service';

@Component({
  selector: 'app-schedule-session-popup',
  imports: [
    FormsModule,
    InputComponent,
    MatDivider,
    MatDialogModule,
    MatButtonModule,
    TranslocoDirective,
    MatOptionModule,
  ],
  templateUrl: './schedule-session-popup.component.html',
  styleUrl: './schedule-session-popup.component.scss',
})
export class ScheduleSessionPopupComponent {
  memberService = inject(MemberService);
  dialogRef = inject(MatDialogRef);
  snackBar = inject(SnackbarService);
  private scheduledSessionService = inject(ScheduledSessionService);

  public selectedSession: ScheduleSession = inject(MAT_DIALOG_DATA);
  members = signal<MemberAccount[]>([]);
  selectedMembers = signal<MemberAccount[]>([]);
  loading = signal(false);

  filters: {
    searchQuery: string;
    branchId: string;
  } = {
    searchQuery: '',
    branchId: '',
  };
  bridgesInputType = BridgesInputType;
  translationTemplate: TranslationTemplates =
    TranslationTemplates.SCHEDULEDSESSION;
  constructor() {
    console.log(this.selectedSession);
  }

  getAll() {
    if (this.filters.searchQuery.length > 2) {
      this.loading.set(true);
      this.memberService
        .getAllMembers(this.filters)
        .pipe(
          finalize(() => this.loading.set(false)),
          debounceTime(250)
        )
        .subscribe((res) => {
          if (res.data) {
            this.members.set(res.data);
            console.log(this.members());
          }
        });
    }
  }
  scheduleSession() {
    // this.loading.set(true);
    const memberIds: string[] = [];
    this.selectedMembers().forEach((member) => {
      memberIds.push(member.id);
    });
    console.log(this.selectedSession);
    console.log(memberIds);
    this.scheduledSessionService
      .addSingleScheduledSession(this.selectedSession, memberIds)
      .pipe(finalize(() => this.loading.set(false)))
      .subscribe({
        next: (res) => {
          console.log(res);
          this.snackBar.success('Session Scheduled Successfully');
          this.dialogRef.close();
        },
        error: (err) => {
          this.snackBar.error(err.message || 'Something went wrong');
        },
      });
  }
  pushMember(member: MemberAccount) {
    this.selectedMembers().push(member);
    this.filters.searchQuery = '';
    this.members.set([]);
    console.log(this.selectedMembers());
  }
  removeMember(id: string) {
    this.selectedMembers.update((list) => {
      list = list.filter((member) => member.id !== id);
      return [...list];
    });
    console.log(this.selectedMembers());
  }
}
