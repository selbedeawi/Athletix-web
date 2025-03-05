import { Tables } from "../../../../../database.types";

export class Sessions implements Tables<"Sessions"> {
  id!: string;
  name!: string;
  description!: string;
  isActive!: boolean;
  branchIds: string[];
  SessionsBranches?: {
    Branch: {
      name: string;
    };
    branchId: string;
  }[];
  constructor() {
    this.branchIds = [];
  }
}
