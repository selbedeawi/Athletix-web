import { DatePipe } from '@angular/common';
import { Component, inject, input, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { MatSidenavModule } from '@angular/material/sidenav';
import { InputComponent } from '../../../../shared/ui-components/atoms/input/input.component';
import { ScheduleCalendarHeaderComponent } from '../schedule-calendar-header/schedule-calendar-header.component';
import { CalendarEvent } from 'angular-calendar';
import { ScheduleSession } from '../../models/schedule-session';
import { BridgesInputType } from '../../../../shared/ui-components/atoms/input/enum/bridges-input-type.enum';
import { BRDGS_OVERLAY_DATA, BrdgsOverlayRef } from '../../../../shared/services/brdgs-overlay.service';
import { MatDialog } from '@angular/material/dialog';
import { ScheduleSessionPopupComponent } from '../schedule-session-popup/schedule-session-popup.component';

@Component({
  selector: 'app-schedule-session-details',
  imports: [FormsModule, MatSidenavModule, MatButtonModule, MatDividerModule, DatePipe, MatIconModule, InputComponent],
  templateUrl: './schedule-session-details.component.html',
  styleUrl: './schedule-session-details.component.scss'
})
export class ScheduleSessionDetailsComponent {
  overlayRef = inject(BrdgsOverlayRef)
  dialog = inject(MatDialog)
  public selectedSession: CalendarEvent<ScheduleSession> = inject(BRDGS_OVERLAY_DATA);

  bridgesInputType = BridgesInputType
  closeOverlay() {
    this.overlayRef.close()
  }
  addMember() {
    this.dialog.open(ScheduleSessionPopupComponent, {
      data: this.selectedSession.meta,
      minWidth: 615
    })
  }
}
