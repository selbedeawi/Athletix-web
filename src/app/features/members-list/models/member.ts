import { Tables } from "../../../../../database.types";
import { StaffAccount } from "../../staff-list/models/staff";

export class MemberAccount implements Tables<"Members"> {
  id!: string;
  firstName!: string;
  lastName!: string;
  memberId!: string | null;

  role: "Member" = "Member";

  dateOfBirth!: string;
  nationalId!: string | null;
  phoneNumber!: string | null;

  isFirstTime!: boolean;

  password!: string;
  email!: string;

  gender!: "male" | "female";

  isActive!: boolean;
  createdBy!: string;
  //FE
  UserMembership!: UserMembership;

  constructor() {
  }
}
export class UserMembership implements Tables<"UserMembership"> {
  // remainingPTSessions: number | null;
  id!: string;

  createdAt!: string;
  createdBy!: string;

  branchId!: string;

  memberId!: string;
  membershipId!: string;
  salesId!: string | null;

  modifiedAt!: string;
  modifiedBy!: string;

  endDate!: string;
  startDate!: string;
  pricePaid!: number;

  freezePeriod!: number;
  remainingFreezePeriod!: number | null;
  isActive!: boolean;

  numberOfInvitations!: number;
  numberOfVisits!: number;

  coachId!: string | null;
  remainingGroupSessions!: number | null;
  // remainingPTSessions!: number | null;
  hasGroupFitness!: boolean;
  hasJacuzzi!: boolean;
  hasSteam!: boolean;
  hasSunna!: boolean;
  name!: string;
  numberOfInBody!: number;
  numberOfPersonalTrainer!: number;
  numberOfSessions!: number | null;
  remainingInBody!: number;
  remainingInvitations!: number;
  remainingPersonalTrainer!: number;
  remainingVisits!: number;
  type!: "Individual" | "PrivateCoach" | "SessionBased";
  freezeEnd!: string | null;
  freezeStart!: string | null;
  isCanceled!: boolean;
  isFreeze!: boolean;
  receiptNumber!: string | null;

  // FE only
  Members!: MemberAccount;
  coach?: StaffAccount;
  salesStaff!: StaffAccount;
}

export class AllMembersFilter {
  searchQuery?: string;
  branchId?: string;
  membershipId?: string;
  salesId?: string;
  type?: "Individual" | "PrivateCoach" | "SessionBased";
  types?: ("Individual" | "PrivateCoach" | "SessionBased")[];
  endDateFrom?: string;
  endDateTo?: string;
  createdFrom?: string;
  createdTo?: string;
  isActive?: boolean | string;
  isActiveUser?: boolean | string;
  isCanceled?: boolean | string;
  isFreeze?: boolean | string;
  coachId?: string;
}
