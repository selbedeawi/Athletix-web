import { CommonModule, DatePipe } from '@angular/common';
import { Component, computed, inject, signal, viewChild } from '@angular/core';
import { CalendarEvent, CalendarModule, CalendarView } from 'angular-calendar';
import { ScheduleCalendarHeaderComponent } from "./components/schedule-calendar-header/schedule-calendar-header.component";
import { ScheduledSessionFilter, ScheduledSessionService } from './services/schedule-sessions.service';
import { startOfMonth, endOfMonth, format } from 'date-fns';
import { finalize } from 'rxjs';
import { ScheduleSession } from './models/schedule-session';
import { MatDrawer, MatSidenavModule } from '@angular/material/sidenav';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { InputComponent } from '../../shared/ui-components/atoms/input/input.component';
import { BridgesInputType } from '../../shared/ui-components/atoms/input/enum/bridges-input-type.enum';
import { FormsModule } from '@angular/forms';
import { BrdgsOverlayService } from '../../shared/services/brdgs-overlay.service';
import { ScheduleSessionDetailsComponent } from './components/schedule-session-details/schedule-session-details.component';

@Component({
  selector: 'app-schedule-management',
  imports: [CalendarModule, CommonModule, ScheduleCalendarHeaderComponent],
  templateUrl: './schedule-management.component.html',
  styleUrl: './schedule-management.component.scss'
})
export class ScheduleManagementComponent {
  private scheduleSessionService = inject(ScheduledSessionService)
  private brdgsOverlayService = inject(BrdgsOverlayService)

  viewDate = signal(new Date());
  selectedSession = signal<CalendarEvent<ScheduleSession> | null>(null);
  events = signal<CalendarEvent<ScheduleSession>[]>([])
  loading = signal(false)

  monthStart = computed(() =>
    format(startOfMonth(this.viewDate()), 'yyyy-LL-dd')
  )

  monthEnd = computed(() =>
    format(endOfMonth(this.viewDate()), 'yyyy-LL-dd')
  )

  view: CalendarView = CalendarView.Month;
  filter: ScheduledSessionFilter = {
    scheduledDateFrom: this.monthStart(),
    scheduledDateTo: this.monthEnd(),
  }
  bridgesInputType = BridgesInputType
  constructor() {
    this.getFilteredSessions()
  }
  getFilteredSessions() {
    this.loading.set(true)
    this.scheduleSessionService.filterScheduledSessions(this.filter).pipe(finalize(() => this.loading.set(true))).subscribe({
      next: (res) => {
        this.events.set([])
        res.forEach(session => {
          this.events.update((eventList) => {
            eventList.push({
              id: session.sessionId,
              start: new Date(session.scheduledDate! + 'T' + session.startTime),
              end: new Date(session.scheduledDate! + 'T' + session.endTime),
              title: 'Meeting with Team',
              meta: { ...session }

            })
            return [...eventList]
          })
        })
        console.log(this.events())
      }
    })
  }

  openSingleSession(event: CalendarEvent<ScheduleSession>) {
    console.log(event)
    if (event.meta) {
      this.brdgsOverlayService.open(ScheduleSessionDetailsComponent, event)
    }
  }
}
