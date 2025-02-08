import { AccountType } from '../../core/enums/account-type-enum';

export class BasicAccount {
  id: string;
  firstName: string;
  lastName: string;
  userName: string;
  isActive: boolean;
  role: AccountType;
  phoneNumber?: string;
  dateOfBirth?: string; // Stored as ISO date string (YYYY-MM-DD)
  nationalId?: string;
  isFirstTime: boolean;
  createdAt: string; // Stored as ISO timestamp

  constructor(
    id: string,
    firstName: string,
    lastName: string,
    userName: string,
    isActive: boolean,
    role: AccountType = AccountType.Member,
    isFirstTime: boolean = true,
    createdAt: string = new Date().toISOString(),
    phoneNumber?: string,
    dateOfBirth?: string,
    nationalId?: string
  ) {
    this.id = id;
    this.firstName = firstName;
    this.lastName = lastName;
    this.userName = userName;
    this.isActive = isActive;
    this.role = role;
    this.phoneNumber = phoneNumber;
    this.dateOfBirth = dateOfBirth;
    this.nationalId = nationalId;
    this.isFirstTime = isFirstTime;
    this.createdAt = createdAt;
  }
}
