import {
  ChangeDetectionStrategy,
  Component,
  inject,
  signal,
} from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { TranslocoDirective } from '@jsverse/transloco';
import { DatePickerComponent } from '../../../../shared/ui-components/atoms/date-picker/date-picker.component';
import { SelectComponent } from '../../../../shared/ui-components/atoms/select/select.component';
import { BridgesInputType } from '../../../../shared/ui-components/atoms/input/enum/bridges-input-type.enum';
import { TranslationTemplates } from '../../../../shared/enums/translation-templates-enum';
import { MatDivider } from '@angular/material/divider';
import { MatRadioModule } from '@angular/material/radio';
import { TimePickerComponent } from '../../../../shared/ui-components/atoms/time-picker/time-picker.component';
import { SessionService } from '../../../sessions-list/services/session.service';
import { finalize } from 'rxjs';
import { Sessions } from '../../../sessions-list/models/sessions';
import {
  ScheduledSessionInsert,
  ScheduledSessionService,
} from '../../services/schedule-sessions.service';
export interface sessionOption {
  key: string;
  value: string;
}
@Component({
  selector: 'app-schedule-single-session',
  imports: [
    SelectComponent,
    FormsModule,
    TranslocoDirective,
    MatButtonModule,
    DatePickerComponent,
    TimePickerComponent,
    MatDivider,
    MatRadioModule,
  ],
  templateUrl: './schedule-single-session.component.html',
  styleUrl: './schedule-single-session.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ScheduleSingleSessionComponent {
  private sessionService = inject(SessionService);
  private scheduledSessionService = inject(ScheduledSessionService);
  translationTemplate: TranslationTemplates =
    TranslationTemplates.SCHEDULEDSESSION;

  scheduledSession = signal<ScheduledSessionInsert[]>([{
    sessionId: '',
    createdAt: new Date().toISOString(),
    startTime: '14:00:00',
    endTime: '15:00:00',
    scheduledDate: new Date().toISOString(),
    branchId: '',
    createdBy: '',
  }]);

  session = '';
  caledar = '';
  time = '';

  sessions = signal<Sessions[]>([]);
  sessionOptions = signal<sessionOption[]>([]);
  isRepeated = signal(false);
  loading = signal(false);

  bridgesInputType = BridgesInputType;
  filter: {
    name?: string;
    branchIds?: string[];
  } = {
    name: '',
    branchIds: [],
  };
  constructor() {
    this.getAllSessions();
  }
  schedule(sessionForm: NgForm) {
    console.log(sessionForm.value);
  }
  getAllSessions() {
    this.loading.set(true);

    this.sessionService
      .getAllSessions(this.filter)
      .pipe(finalize(() => this.loading.set(false)))
      .subscribe((res) => {
        this.sessions.set(res.data);
        this.sessions().forEach((session) => {
          this.sessionOptions().push({ key: session.name, value: session.id });
        });
        console.log(this.sessions());
      });
  }
}
