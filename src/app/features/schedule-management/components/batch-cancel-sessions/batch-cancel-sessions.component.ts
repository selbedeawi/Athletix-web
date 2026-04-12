import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDialogModule, MatDialogRef, MatDialog } from '@angular/material/dialog';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { TranslocoDirective } from '@jsverse/transloco';
import { DatePipe } from '@angular/common';
import { TranslationTemplates } from '../../../../shared/enums/translation-templates-enum';
import { SelectComponent } from '../../../../shared/ui-components/atoms/select/select.component';
import { DatePickerComponent } from '../../../../shared/ui-components/atoms/date-picker/date-picker.component';
import { ScheduledSessionService, ScheduledSessionFilter } from '../../services/schedule-sessions.service';
import { SessionService } from '../../../sessions-list/services/session.service';
import { BranchesService } from '../../../../core/services/branches/branches.service';
import { SnackbarService } from '../../../../core/services/snackbar/snackbar.service';
import { ConfirmDeleteComponent } from '../../../../shared/ui-components/templates/confirm-delete/confirm-delete.component';
import { ScheduleSession } from '../../models/schedule-session';
import { filter, finalize, Subject, takeUntil } from 'rxjs';
import { sessionOption } from '../schedule-single-session/schedule-single-session.component';

@Component({
    selector: 'app-batch-cancel-sessions',
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
    ],
    templateUrl: './batch-cancel-sessions.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BatchCancelSessionsComponent {
    private service = inject(ScheduledSessionService);
    private sessionService = inject(SessionService);
    private branchService = inject(BranchesService);
    private snackbar = inject(SnackbarService);
    private matDialog = inject(MatDialog);
    dialogRef = inject(MatDialogRef<BatchCancelSessionsComponent>);

    translationTemplate = TranslationTemplates.SCHEDULEDSESSION;
    loading = signal(false);
    cancelling = signal(false);
    sessions = signal<ScheduleSession[]>([]);
    selectedIds = signal<Set<string>>(new Set());
    sessionOptions = signal<sessionOption[]>([]);
    private destroyed$ = new Subject<void>();
    private branchId = '';

    // Filter state
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
        this.service.filterSessionsForBatchCancel(f)
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

    cancel() {
        const ids = Array.from(this.selectedIds());
        if (!ids.length) return;
        this.cancelling.set(true);
        this.service.batchCancelSessions(ids)
            .pipe(finalize(() => this.cancelling.set(false)))
            .subscribe({
                next: () => {
                    this.snackbar.success('BATCH_CANCEL_SUCCESS');
                    this.dialogRef.close(true);
                },
                error: () => this.snackbar.error('EDIT_SESSION_ERROR'),
            });
    }

    confirmAndCancel() {
        const count = this.selectedIds().size;
        this.matDialog.open(ConfirmDeleteComponent, {
            data: {
                translationTemplate: this.translationTemplate,
                headerText: 'BATCH_CANCEL_CONFIRM_HEADER',
                content: 'BATCH_CANCEL_CONFIRM_CONTENT',
                cancelText: 'NO',
                okText: 'YES',
            },
        }).afterClosed().subscribe(confirmed => {
            if (confirmed) this.cancel();
        });
    }

    ngOnDestroy() {
        this.destroyed$.next();
        this.destroyed$.complete();
    }
}
