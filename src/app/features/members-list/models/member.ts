import { Tables } from "../../../../../database.types";

export class MemberAccount implements Tables<"Members"> {
  id!: string;
  firstName!: string;
  lastName!: string;
  memberId!: number;

  role: "Member" = "Member";

  dateOfBirth!: string;
  nationalId!: string | null;
  phoneNumber!: string | null;

  isFirstTime!: boolean;

  password!: string;
  email!: string;

  isActive!: boolean;
  createdBy!: string;

  constructor() {
  }
}
export class UserMembership implements Tables<"UserMembership"> {
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
  remainingPTSessions!: number | null;
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
  constructor(memberId: string) {
    this.memberId = memberId;
  }
}
