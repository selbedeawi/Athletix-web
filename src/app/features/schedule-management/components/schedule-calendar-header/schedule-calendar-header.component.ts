import { DatePipe } from '@angular/common';
import { Component, computed, input, model, output } from '@angular/core';
import { CalendarModule, CalendarView } from 'angular-calendar';
import {startOfMonth,endOfMonth} from 'date-fns'
@Component({
  selector: 'app-schedule-calendar-header',
  imports: [CalendarModule,DatePipe],
  templateUrl: './schedule-calendar-header.component.html',
  styleUrl: './schedule-calendar-header.component.scss'
})
export class ScheduleCalendarHeaderComponent {
view = input<CalendarView>(CalendarView.Month)

viewDate = model.required<Date>()

viewChange = output<CalendarView>()
viewDateChange = output<Date>()

MonthStart=computed(()=>startOfMonth(this.viewDate()))
MonthEnd=computed(()=>endOfMonth(this.viewDate()))

  CalendarView = CalendarView;
}
