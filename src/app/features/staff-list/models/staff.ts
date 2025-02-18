import { Tables } from "../../../../../database.types";

export class StaffAccount implements Tables<"Staff"> {
  firstName: string;
  id!: string;
  isActive: boolean;
  lastName: string;
  phoneNumber: string | null;
  role: "Sales" | "Receptionist" | "Coach" | "SalesManager" | "SessionManager";
  userName: string;
  email: string;
  password!: string;

  constructor(
    role:
      | "Sales"
      | "Receptionist"
      | "Coach"
      | "SalesManager"
      | "SessionManager",
  ) {
    this.firstName = "";
    this.lastName = "";
    this.email = "";
    this.phoneNumber = "";
    this.role = role;
    this.userName = "";
    this.isActive = true;
  }
}
