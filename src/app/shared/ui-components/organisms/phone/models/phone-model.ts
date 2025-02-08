export class Phone {
  id!: number;
  number: string;
  extension: string;
  phoneType: PhoneTypes;
  isSamePhoneAsPrimary?: boolean;
  constructor(type: PhoneTypes) {
    this.phoneType = type;
    this.number = '';
    this.extension = '';
  }
}
export enum PhoneTypes {
  mobilePhone = 'MobilePhone',
  homePhone = 'HomePhone',
}
