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
