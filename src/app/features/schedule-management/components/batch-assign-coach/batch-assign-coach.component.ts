import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { TranslocoDirective } from '@jsverse/transloco';
import { DatePipe } from '@angular/common';
import { TranslationTemplates } from '../../../../shared/enums/translation-templates-enum';
import { SelectComponent } from '../../../../shared/ui-components/atoms/select/select.component';
import { DatePickerComponent } from '../../../../shared/ui-components/atoms/date-picker/date-picker.component';
import { SelectStaffComponent } from '../../../../shared/ui-components/molecules/select-staff/select-staff.component';
import { ScheduledSessionService, ScheduledSessionFilter } from '../../services/schedule-sessions.service';
import { SessionService } from '../../../sessions-list/services/session.service';
import { BranchesService } from '../../../../core/services/branches/branches.service';
import { SnackbarService } from '../../../../core/services/snackbar/snackbar.service';
import { ScheduleSession } from '../../models/schedule-session';
import { filter, finalize, Subject, takeUntil } from 'rxjs';
import { sessionOption } from '../schedule-single-session/schedule-single-session.component';

@Component({
    selector: 'app-batch-assign-coach',
    imports: [
        FormsModule,
        MatButtonModule,
        MatCheckboxModule,
        MatDialogModule,
        MatDividerModule,
        MatIconModule,
        MatProgressSpinnerModule,
        TranslocoDirective,
        DatePipe,
        SelectComponent,
        DatePickerComponent,
        SelectStaffComponent,
    ],
    templateUrl: './batch-assign-coach.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BatchAssignCoachComponent {
    private service = inject(ScheduledSessionService);
    private sessionService = inject(SessionService);
    private branchService = inject(BranchesService);
    private snackbar = inject(SnackbarService);
    dialogRef = inject(MatDialogRef<BatchAssignCoachComponent>);

    translationTemplate = TranslationTemplates.SCHEDULEDSESSION;
    loading = signal(false);
    assigning = signal(false);
    sessions = signal<any[]>([]);
    selectedIds = signal<Set<string>>(new Set());
    sessionOptions = signal<sessionOption[]>([]);
    coachId = signal<string[]>([]);
    private destroyed$ = new Subject<void>();
    private branchId = '';

    dateFrom = signal('');
    dateTo = signal('');
    filterSessionId = signal('');
    readonly today = new Date().toISOString().split('T')[0];

    constructor() {
        this.branchService.currentBranch$
            .pipe(filter(b => !!b), takeUntil(this.destroyed$))
            .subscribe(branch => {
                this.branchId = branch.id;
                this.sessionService.getAllSessions({ branchIds: [branch.id] }, 1, 1000)
                    .subscribe(res => {
                        this.sessionOptions.set(res.data?.map(s => ({ key: s.name, value: s.id })) ?? []);
                    });
            });
    }

    search() {
        if (!this.dateFrom() || !this.dateTo()) return;
        const f: ScheduledSessionFilter = {
            scheduledDateFrom: this.dateFrom(),
            scheduledDateTo: this.dateTo(),
            branchId: this.branchId,
            sessionId: this.filterSessionId() || undefined,
        };
        this.loading.set(true);
        this.selectedIds.set(new Set());
        this.service.filterSessionsForBatchAssign(f)
            .pipe(finalize(() => this.loading.set(false)))
            .subscribe({ next: res => this.sessions.set(res) });
    }

    toggleAll(checked: boolean) {
        this.selectedIds.set(
            checked ? new Set(this.sessions().map(s => s.id)) : new Set()
        );
    }

    toggle(id: string, checked: boolean) {
        const s = new Set(this.selectedIds());
        checked ? s.add(id) : s.delete(id);
        this.selectedIds.set(s);
    }

    isSelected(id: string) { return this.selectedIds().has(id); }

    get allSelected(): boolean {
        return this.sessions().length > 0 && this.selectedIds().size === this.sessions().length;
    }

    get someSelected(): boolean {
        return this.selectedIds().size > 0 && !this.allSelected;
    }

    coachNames(coaches: any[]): string {
        return coaches?.map(c => `${c.Staff?.firstName ?? ''} ${c.Staff?.lastName ?? ''}`.trim()).filter(Boolean).join(', ') ?? '';
    }

    get canAssign(): boolean {
        return this.selectedIds().size > 0 && this.coachId().length > 0 && !this.assigning();
    }

    assign() {
        const ids = Array.from(this.selectedIds());
        const coachIds = this.coachId();
        if (!ids.length || !coachIds.length) return;
        this.assigning.set(true);
        this.service.batchAssignCoach(ids, coachIds)
            .pipe(finalize(() => this.assigning.set(false)))
            .subscribe({
                next: () => {
                    this.snackbar.success('BATCH_ASSIGN_SUCCESS');
                    this.dialogRef.close(true);
                },
                error: () => this.snackbar.error('EDIT_SESSION_ERROR'),
            });
    }

    ngOnDestroy() {
        this.destroyed$.next();
        this.destroyed$.complete();
    }
}
