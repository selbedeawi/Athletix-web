import { Tables } from "../../../../../database.types";

export class Sessions implements Tables<"Sessions"> {
  id!: string;
  name!: string;
  description!: string;
  isActive!: boolean;

  imageUrl!: string | null;
  level!: string | null;
  // FE only
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
