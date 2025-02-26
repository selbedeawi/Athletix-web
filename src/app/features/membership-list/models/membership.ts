import { Database, Tables } from "../../../../../database.types";

export type MembershipType = Database["public"]["Enums"]["membership_type"];

export class Memberships implements Tables<"Memberships"> {
  id!: string;
  name!: string;
  type!: MembershipType;

  amount!: number;
  amountAfterDiscount!: number;

  durationInDays!: number;
  freezePeriod!: number;

  hasGroupFitness!: boolean | null;
  hasJacuzzi!: boolean | null;
  hasSteam!: boolean | null;
  hasSunna!: boolean | null;

  inBodyCount!: number;
  personalTrainerCount!: number;

  numberOfSessions!: number | null;
  numberOfVisits!: number;
  numberOfInvitations!: number;

  updatedAt!: string;
  createdAt!: string;
  modifiedAt!: string;

  branchIds: string[];
  MembershipBranches?: {
    Branch: {
      name: string;
    };
    branchId: string;
  }[];
  constructor() {
    this.branchIds = [];
  }
}
