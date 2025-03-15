import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { TranslocoDirective } from '@jsverse/transloco';
import { DatePickerComponent } from '../../../../shared/ui-components/atoms/date-picker/date-picker.component';
import { InputComponent } from '../../../../shared/ui-components/atoms/input/input.component';
import { SelectComponent } from '../../../../shared/ui-components/atoms/select/select.component';
import { SelectMembershipComponent } from '../../../../shared/ui-components/molecules/select-membership/select-membership.component';
import { BridgesInputType } from '../../../../shared/ui-components/atoms/input/enum/bridges-input-type.enum';
import { TranslationTemplates } from '../../../../shared/enums/translation-templates-enum';
import { MatDivider } from '@angular/material/divider';
import { RadioButtonComponent } from "../../../../shared/ui-components/atoms/radio-button/radio-button.component";
import { MatRadioModule } from '@angular/material/radio';
import { TimePickerComponent } from '../../../../shared/ui-components/atoms/time-picker/time-picker.component';

@Component({
  selector: 'app-schedule-single-session',
  imports: [
    SelectComponent,
    FormsModule,
    TranslocoDirective,
    MatButtonModule,
    SelectMembershipComponent,
    DatePickerComponent,
    TimePickerComponent,
    MatDivider,
    MatRadioModule,
],
  templateUrl: './schedule-single-session.component.html',
  styleUrl: './schedule-single-session.component.scss',
  changeDetection:ChangeDetectionStrategy.OnPush
})
export class ScheduleSingleSessionComponent {
  translationTemplate: TranslationTemplates = TranslationTemplates.SCHEDULEDSESSION;
  session=''
caledar=''
isRepeated=signal(false)
    bridgesInputType = BridgesInputType;
  schedule(){}
  repeat(event:any){
console.log(event.value)
  }
}
