import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { CalendarEvent, CalendarModule, CalendarView } from 'angular-calendar';
import { ScheduleCalendarHeaderComponent } from "./components/schedule-calendar-header/schedule-calendar-header.component";
@Component({
  selector: 'app-schedule-management',
  imports: [CalendarModule, CommonModule, ScheduleCalendarHeaderComponent],
  templateUrl: './schedule-management.component.html',
  styleUrl: './schedule-management.component.scss'
})
export class ScheduleManagementComponent {
  view: CalendarView = CalendarView.Month;

  viewDate: Date = new Date();

  events: CalendarEvent[] = [
      {
        id: 1,
        start: new Date('2025-03-01T10:00:00'),
        end: new Date('2025-03-01T11:00:00'),
        title: 'Meeting with Team',
        color: { primary: '#ad2121', secondary: '#FAE3E3' },
        // actions: [{ label: 'Cancel', onClick: (event) => console.log('Event canceled', event) }],
        allDay: false,
        cssClass: 'meeting-class',
        draggable: true,
        meta: { location: 'Conference Room A' }
    },
    // {
    //     id: 2,
    //     start: new Date('2023-10-02T09:00:00'),
    //     end: new Date('2023-10-02T09:30:00'),
    //     title: 'Daily Standup',
    //     color: { primary: '#1e90ff', secondary: '#D1E8FF' },
    //     allDay: true,
    //     cssClass: 'standup-class',
    //     resizable: { beforeStart: false, afterEnd: false },
    //     draggable: false,
    //     meta: { participants: ['Alice', 'Bob', 'Charlie'] }
    // },
    // {
    //     id: 3,
    //     start: new Date('2023-10-03T14:00:00'),
    //     title: 'Project Deadline',
    //     allDay: true,
    //     meta: { priority: 'High' }
    // }
  ];
}
