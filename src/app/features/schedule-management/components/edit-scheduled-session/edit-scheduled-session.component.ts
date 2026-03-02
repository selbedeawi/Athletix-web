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
import { ScheduledSessionService } from '../../services/schedule-sessions.service';
import { SnackbarService } from '../../../../core/services/snackbar/snackbar.service';
import { ScheduleSession } from '../../models/schedule-session';
import { finalize } from 'rxjs';

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
        TranslocoDirective,
    ],
    templateUrl: './edit-scheduled-session.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EditScheduledSessionComponent {
    private service = inject(ScheduledSessionService);
    private snackbar = inject(SnackbarService);
    dialogRef = inject(MatDialogRef<EditScheduledSessionComponent>);
    session: ScheduleSession = inject(MAT_DIALOG_DATA);

    translationTemplate = TranslationTemplates.SCHEDULEDSESSION;
    loading = signal(false);

    // `staffId` matches the model signal name expected by SelectStaffComponent.
    // Pre-populate with the existing coaches' IDs.
    staffId = model<string[]>(
        (this.session.SheduleCoaches as any)?.map((sc: any) => sc.Staff?.id ?? sc.coachId) ?? []
    );
    limitSpots = signal(this.session.maxSpots !== null && this.session.maxSpots !== undefined);
    maxSpots = signal<number | null>(this.session.maxSpots ?? null);

    // Current number of bookings — max spots cannot be set below this.
    bookedCount = this.session.bookedCount ?? 0;

    get isBelowBooked(): boolean {
        return this.limitSpots() &&
            this.maxSpots() !== null &&
            (this.maxSpots() as number) < this.bookedCount;
    }

    save() {
        if (this.isBelowBooked) return;
        const spots = this.limitSpots() ? this.maxSpots() : null;
        this.loading.set(true);
        this.service
            .updateScheduledSession(this.session.id, spots, this.staffId() ?? [])
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
}
