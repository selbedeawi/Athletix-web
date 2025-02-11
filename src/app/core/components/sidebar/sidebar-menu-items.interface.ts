import { AccountType } from "../../enums/account-type-enum";

export interface SidenavMenuItem {
  icon: string;
  label: string;
  path: string[];
  permissions: AccountType[];
}
