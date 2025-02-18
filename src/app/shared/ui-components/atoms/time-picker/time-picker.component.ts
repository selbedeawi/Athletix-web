import {
  ChangeDetectionStrategy,
  Component,
  inject,
  input,
  model,
  OnChanges,
  OnInit,
  signal,
  SimpleChanges,
  viewChild,
} from '@angular/core';
import {
  ControlContainer,
  FormsModule,
  NgForm,
  NgModel,
  Validators,
} from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatTimepickerModule } from '@angular/material/timepicker';
import { DateAdapter, provideNativeDateAdapter } from '@angular/material/core';
import { TranslocoDirective } from '@jsverse/transloco';
import { TranslationTemplates } from '../../../enums/translation-templates-enum';

@Component({
  selector: 'brdgs-time-picker',
  standalone: true,
  imports: [
    MatFormFieldModule,
    MatInputModule,
    FormsModule,
    MatTimepickerModule,
    TranslocoDirective,
  ],
  templateUrl: './time-picker.component.html',
  styleUrl: './time-picker.component.scss',
  providers: [provideNativeDateAdapter()],
  changeDetection: ChangeDetectionStrategy.OnPush,
  viewProviders: [{ provide: ControlContainer, useExisting: NgForm }],
})
export class TimePickerComponent implements OnChanges {
  translationTemplates = TranslationTemplates.GLOB;
  private readonly _adapter =
    inject<DateAdapter<unknown, unknown>>(DateAdapter);
  rondom = Math.random();

  public ngModel = viewChild.required<NgModel>('valueInput');

  // Input properties
  public isRequired = input.required<boolean>();
  public label = input.required<string>();

  public isDisabled = input<boolean>(false);
  public placeholder = input<string>();
  public value = model<string | null>();
  public dateTime = model<Date | null>(null);

  public timepickerMax = input<string | null>(null);
  public timepickerMin = input<string | null>(null);
  public interval = input<string | null>(null);

  setValue(e: Date) {
    this.value.set(this.formatTime(e));
  }
  private formatTime(date: Date): string | null {
    if (!(date instanceof Date) || isNaN(date.getTime())) {
      return null;
    }
    const hours = date?.getHours()?.toString()?.padStart(2, '0');
    const minutes = date?.getMinutes()?.toString()?.padStart(2, '0');

    return `${hours}:${minutes}`;
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['value']) {
      if (changes['value'].currentValue) {
        this.timeStringToDate(changes['value'].currentValue);
      } else {
        this.dateTime.set(null);
      }
    }
  }
  ngAfterViewInit() {
    const validationArray = [];
    if (this.isRequired()) {
      validationArray.push(Validators.required);
    }
    this.ngModel()?.control.setValidators(validationArray);
  }

  /**
   * Converts a "HH:MM" string to a Date.
   * Uses today's date as the base.
   */
  private timeStringToDate(time: string) {
    if (!time) return;
    const parts = time.split(':');
    if (parts.length !== 2) return;
    const [hoursStr, minutesStr] = parts;
    const hours = Number(hoursStr);
    const minutes = Number(minutesStr);
    if (isNaN(hours) || isNaN(minutes)) return;
    const date = new Date();
    date.setHours(hours, minutes, 0, 0);
    this.dateTime.set(date);
  }
}
