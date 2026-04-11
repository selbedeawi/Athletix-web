import { ChangeDetectionStrategy, Component, inject, model, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { TranslocoDirective } from '@jsverse/transloco';
import { TranslationTemplates } from '../../../../shared/enums/translation-templates-enum';
import { SelectStaffComponent } from '../../../../shared/ui-components/molecules/select-staff/select-staff.component';
import { SelectComponent } from '../../../../shared/ui-components/atoms/select/select.component';
import { DatePickerComponent } from '../../../../shared/ui-components/atoms/date-picker/date-picker.component';
import { TimePickerComponent } from '../../../../shared/ui-components/atoms/time-picker/time-picker.component';
import { ScheduledSessionService } from '../../services/schedule-sessions.service';
import { SnackbarService } from '../../../../core/services/snackbar/snackbar.service';
import { ScheduleSession } from '../../models/schedule-session';
import { SessionService } from '../../../sessions-list/services/session.service';
import { BranchesService } from '../../../../core/services/branches/branches.service';
import { filter, finalize, takeUntil, Subject } from 'rxjs';
import { sessionOption } from '../schedule-single-session/schedule-single-session.component';
import { format } from 'date-fns';

@Component({
    selector: 'app-edit-scheduled-session',
    imports: [
        FormsModule,
        MatButtonModule,
        MatDialogModule,
        MatFormFieldModule,
        MatInputModule,
        MatSlideToggleModule,
        SelectStaffComponent,
        SelectComponent,
        DatePickerComponent,
        TimePickerComponent,
        TranslocoDirective,
    ],
    templateUrl: './edit-scheduled-session.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EditScheduledSessionComponent {
    private service = inject(ScheduledSessionService);
    private snackbar = inject(SnackbarService);
    private sessionService = inject(SessionService);
    private branchService = inject(BranchesService);
    dialogRef = inject(MatDialogRef<EditScheduledSessionComponent>);
    session: ScheduleSession = inject(MAT_DIALOG_DATA);

    translationTemplate = TranslationTemplates.SCHEDULEDSESSION;
    loading = signal(false);
    private destroyed$ = new Subject<void>();

    // Coaches — pre-populated
    staffId = model<string[]>(
        (this.session.SheduleCoaches as any)?.map((sc: any) => sc.Staff?.id ?? sc.coachId) ?? []
    );

    // Spots
    limitSpots = signal(this.session.maxSpots !== null && this.session.maxSpots !== undefined);
    maxSpots = signal<number | null>(this.session.maxSpots ?? null);
    bookedCount = this.session.bookedCount ?? 0;

    // New editable fields
    sessionId = signal<string>(this.session.sessionId);
    scheduledDate = signal<string>(this.session.scheduledDate ?? '');
    startTime = signal<string>(this.session.startTime?.slice(0, 5) ?? '');
    endTime = signal<string>(this.session.endTime?.slice(0, 5) ?? '');

    sessionOptions = signal<sessionOption[]>([]);
    today = new Date();

    constructor() {
        this.branchService.currentBranch$
            .pipe(filter(b => !!b), takeUntil(this.destroyed$))
            .subscribe(branch => {
                this.sessionService.getAllSessions({ branchIds: [branch.id] }, 1, 1000)
                    .subscribe(res => {
                        this.sessionOptions.set(res.data?.map(s => ({ key: s.name, value: s.id })) ?? []);
                    });
            });
    }

    get isBelowBooked(): boolean {
        return this.limitSpots() &&
            this.maxSpots() !== null &&
            (this.maxSpots() as number) < this.bookedCount;
    }

    updateEndTime(startTime: string | null | undefined) {
        if (!startTime) return;
        const parts = startTime.split(':');
        let h = Number(parts[0]);
        const m = parts[1];
        h = h >= 23 ? 23 : h + 1;
        this.endTime.set(`${String(h).padStart(2, '0')}:${m}`);
    }

    save() {
        if (this.isBelowBooked) return;
        const spots = this.limitSpots() ? this.maxSpots() : null;
        this.loading.set(true);
        this.service
            .updateScheduledSession(
                this.session.id,
                spots,
                this.staffId() ?? [],
                this.sessionId(),
                this.scheduledDate(),
                this.startTime(),
                this.endTime()
            )
            .pipe(finalize(() => this.loading.set(false)))
            .subscribe({
                next: () => {
                    this.snackbar.success('EDIT_SESSION_SUCCESS');
                    this.dialogRef.close(true);
                },
                error: (err: any) => {
                    const msg: string = err?.message ?? JSON.stringify(err ?? '');
                    if (msg.includes('BELOW_BOOKED_COUNT')) {
                        this.snackbar.error('BELOW_BOOKED_COUNT_ERROR');
                    } else {
                        this.snackbar.error('EDIT_SESSION_ERROR');
                    }
                },
            });
    }

    ngOnDestroy() {
        this.destroyed$.next();
        this.destroyed$.complete();
    }
}
