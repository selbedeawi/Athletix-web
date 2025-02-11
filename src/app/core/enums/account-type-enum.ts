// export enum AccountType {
//   SuperAdmin = 'SuperAdmin',
//   Sales = 'Sales',
//   Receptionist = 'Receptionist',
//   Coach = 'Coach',
//   SalesManager = 'SalesManager',
//   SessionManager = 'SessionManager',
//   Member = 'Member',

import { Database } from "../../../../database.types";

// }
export type AccountType = Database["public"]["Enums"]["user_role"];
