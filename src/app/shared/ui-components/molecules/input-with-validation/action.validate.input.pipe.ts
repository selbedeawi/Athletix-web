import { Pipe, PipeTransform } from '@angular/core';
import { IValidateTemplate } from './validation.password.template';

@Pipe({
  name: 'validateAction',
  pure: true,
})
export class ValidateTemplatePipe implements PipeTransform {
  transform(
    value: { text: string; action: IValidateTemplate },
    args?: any
  ): any {
    return this.validateAction(value);
  }

  validateAction(value: { text: string; action: IValidateTemplate }): boolean {
    return value.action.validate(value.text);
  }
}
