import { DatePipe } from "@angular/common";
import {
  Component,
  computed,
  inject,
  input,
  model,
  output,
} from "@angular/core";
import { CalendarModule, CalendarView } from "angular-calendar";
import { endOfMonth, startOfMonth } from "date-fns";
import { ScheduledSessionService } from "../../services/schedule-sessions.service";
import { TranslocoDirective } from "@jsverse/transloco";
import { TranslationTemplates } from "../../../../shared/enums/translation-templates-enum";

@Component({
  selector: "app-schedule-calendar-header",
  imports: [CalendarModule, DatePipe,
    TranslocoDirective
  ],
  templateUrl: "./schedule-calendar-header.component.html",
  styleUrl: "./schedule-calendar-header.component.scss",
})
export class ScheduleCalendarHeaderComponent {
  ScheduledSessionService = inject(ScheduledSessionService);
  view = input<CalendarView>(CalendarView.Month);

  viewDate = model.required<Date>();

  viewChange = output<CalendarView>();
  viewDateChange = output<Date>();

  MonthStart = computed(() => startOfMonth(this.viewDate()));
  MonthEnd = computed(() => endOfMonth(this.viewDate()));

  CalendarView = CalendarView;
    translationTemplate: TranslationTemplates =
    TranslationTemplates.SCHEDULEDSESSION;
  constructor() {
    this.ScheduledSessionService;
  }
}
