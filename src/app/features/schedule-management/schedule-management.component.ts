import { CommonModule } from '@angular/common';
import { Component, computed, inject, signal } from '@angular/core';
import { CalendarEvent, CalendarModule, CalendarView } from 'angular-calendar';
import { ScheduleCalendarHeaderComponent } from "./components/schedule-calendar-header/schedule-calendar-header.component";
import { ScheduledSessionFilter, ScheduledSessionService } from './services/schedule-sessions.service';
import { startOfMonth, endOfMonth, format } from 'date-fns';
import { finalize } from 'rxjs';
import { ScheduleSession } from './models/schedule-session';

@Component({
  selector: 'app-schedule-management',
  imports: [CalendarModule, CommonModule, ScheduleCalendarHeaderComponent],
  templateUrl: './schedule-management.component.html',
  styleUrl: './schedule-management.component.scss'
})
export class ScheduleManagementComponent {
  private scheduleSessionService = inject(ScheduledSessionService)

  viewDate = signal(new Date());
  ScheduledSessions = signal<ScheduleSession[]>([]);
  events = signal<CalendarEvent<ScheduleSession>[]>([])
  loading = signal(false)

  monthStart = computed(() =>
    format(startOfMonth(this.viewDate()), 'yyyy-LL-dd')
  )

  monthEnd = computed(() =>
    format(endOfMonth(this.viewDate()), 'yyyy-LL-dd')
  )

  view: CalendarView = CalendarView.Month;
  
  constructor() {
    this.getFilteredSessions()
  }
  getFilteredSessions() {
  const  filter: ScheduledSessionFilter = {
      scheduledDateFrom: this.monthStart(),
      scheduledDateTo: this.monthEnd(),
    }
    this.loading.set(true)
    this.scheduleSessionService.filterScheduledSessions(filter).pipe(finalize(() => this.loading.set(true))).subscribe({
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
  }
}
