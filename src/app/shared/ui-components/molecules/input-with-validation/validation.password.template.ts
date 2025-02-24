import { TranslocoService } from '@jsverse/transloco';

export interface IValidateTemplate {
  text: string;
  validate: Function;
}

export class PasswordTemplate {
  static getInstance(translocoService: TranslocoService) {
    return [
      {
        text: translocoService.translate(
          'PASSWORD_MUST_BE_BETWEEN_8_AND_36_CHARACTERS'
        ),
        validate: (password: string) => {
          return password.length <= 36 && password.length >= 8;
        },
      },
      {
        text: translocoService.translate(
          'PASSWORD_MUST_CONTAIN_ONE_LOWER_CASE'
        ),
        validate: (password: string) => {
          return /w*[a-z]/.test(password);
        },
      },
      {
        text: translocoService.translate(
          'PASSWORD_MUST_CONTAIN_ONE_UPPER_CASE'
        ),
        validate: (password: string) => {
          return /w*[A-Z]/.test(password);
        },
      },
      {
        text: translocoService.translate('PASSWORD_MUST_CONTAIN_ONE_DIGIT'),
        validate: (password: string) => {
          return /w*[0-9]/.test(password);
        },
      },
      {
        text: translocoService.translate('PASSWORD_MUST_NOT_CONTAIN_SPACE'),

        validate: (password: string) => {
          return password && password.indexOf(' ') === -1;
        },
      },
    ] as Array<IValidateTemplate>;
  }
}
