import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { CalendarEvent, CalendarModule, CalendarView } from 'angular-calendar';
import { ScheduleCalendarHeaderComponent } from './components/schedule-calendar-header/schedule-calendar-header.component';
@Component({
  selector: 'app-schedule-management',
  imports: [CalendarModule, CommonModule, ScheduleCalendarHeaderComponent],
  templateUrl: './schedule-management.component.html',
  styleUrl: './schedule-management.component.scss',
})
export class ScheduleManagementComponent {
  view: CalendarView = CalendarView.Month;

  viewDate: Date = new Date();

  events: CalendarEvent[] = [];
}
