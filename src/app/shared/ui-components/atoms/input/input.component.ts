import {
  ChangeDetectionStrategy,
  Component,
  input,
  viewChild,
  model,
} from '@angular/core';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import {
  ControlContainer,
  FormsModule,
  NgForm,
  NgModel,
  Validators,
} from '@angular/forms';
import { BridgesInputType } from './enum/bridges-input-type.enum';
import { NgxMaskDirective, provideNgxMask } from 'ngx-mask';
@Component({
  selector: 'brdgs-input',
  standalone: true,
  imports: [MatFormFieldModule, MatInputModule, FormsModule, NgxMaskDirective],
  templateUrl: './input.component.html',
  styleUrls: ['./input.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [provideNgxMask()],
  viewProviders: [{ provide: ControlContainer, useExisting: NgForm }],
})
export class InputComponent {
  rondom = Math.random();
  public ngModel = viewChild.required<NgModel>('valueInput');
  // Input properties
  public isRequired = input.required<boolean>();
  public label = input.required<string>();
  public type = input.required<BridgesInputType>();
  public isDisabled = input<boolean>(false);
  public placeholder = input<string>();
  public prefix = input<boolean>();
  public suffix = input<boolean>();
  public mask = input<string>('');
  public value = model<string | number | null>();

  private patterns: Record<BridgesInputType, RegExp | string> = {
    [BridgesInputType.TEXT]: null as any,
    [BridgesInputType.NUMBER]: /^[0-9]*$/,
    [BridgesInputType.EMAIL]:
      /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
    [BridgesInputType.TEL]: /^\+?[1-9]{1}[0-9]{9}$/,
    [BridgesInputType.PASSWORD]: null as any,
    [BridgesInputType.POSTALCODE]: /[0-9a-zA-z]{6}/,
  };

  ngAfterViewInit() {
    const currentType = this.type();
    const validationArray = [Validators.pattern(this.patterns[currentType])];
    if (this.isRequired()) {
      validationArray.push(Validators.required);
    }
    this.ngModel()?.control.setValidators(validationArray);
  }
}
