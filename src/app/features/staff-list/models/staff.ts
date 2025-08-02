import { Tables } from '../../../../../database.types';
import { AccountType } from '../../../core/enums/account-type-enum';

export class StaffAccount implements Tables<'Staff'> {
  firstName: string;
  id!: string;
  isActive: boolean;
  lastName: string;
  phoneNumber: string | null;
  role: AccountType;

  email: string;
  password!: string;
  confirmPassword!: string;
  branchIds: string[];
  StaffBranch?: {
    Branch: {
      name: string;
    };
    branchId: string;
  }[];
  isDeleted: boolean;
  constructor(role: AccountType) {
    this.firstName = '';
    this.lastName = '';
    this.email = '';
    this.phoneNumber = '';
    this.role = role;
    this.isActive = true;
    this.isDeleted = false;
    this.branchIds = [];
  }
}
