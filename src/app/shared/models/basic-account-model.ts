import { Database, Tables } from "../../../../database.types";
import { AccountType } from "../../core/enums/account-type-enum";

export class BasicAccount implements Tables<"accounts"> {
  createdAt: string | null;
  dateOfBirth: string | null;
  email: string | null;
  firstName: string;
  id: string;
  isActive: boolean;
  isFirstTime: boolean;
  lastName: string;
  nationalId: string | null;
  phoneNumber: string | null;
  role: AccountType;
  userName: string;
  constructor(
    id: string,
    firstName: string,
    lastName: string,
    userName: string,
    isActive: boolean,
    role: AccountType = "Member",
    isFirstTime: boolean = true,
    createdAt: string = new Date().toISOString(),
    phoneNumber?: string,
    dateOfBirth?: string,
    nationalId?: string,
  ) {
    this.id = id;
    this.firstName = firstName;
    this.lastName = lastName;
    this.userName = userName;
    this.isActive = isActive;
    this.role = role;
    this.phoneNumber = phoneNumber ?? null;
    this.dateOfBirth = dateOfBirth ?? null;
    this.nationalId = nationalId ?? null;
    this.isFirstTime = isFirstTime;
    this.createdAt = createdAt;
    this.email = "";
  }
}
