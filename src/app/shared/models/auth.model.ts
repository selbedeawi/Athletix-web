import { AccountType } from '../../core/enums/account-type-enum';
import { APP_ROUTES } from '../../core/enums/pages-urls-enum';

export interface ILoginRes {
  token: string;
  requireVerification: boolean;
  user: { accountId: number; role: AccountType };
}

export const roleRouteMapping: { [key in AccountType]: APP_ROUTES } = {
  [AccountType.SuperAdmin]: APP_ROUTES.ADMIN,
  [AccountType.SalesManager]: APP_ROUTES.ASSOCIATE,
  [AccountType.SessionManager]: APP_ROUTES.COORDINATOR,
  [AccountType.Sales]: APP_ROUTES.FAMILY_DASHBOARD,
  [AccountType.Receptionist]: APP_ROUTES.FAMILY,
  [AccountType.Coach]: APP_ROUTES.FAMILY,
  [AccountType.Member]: APP_ROUTES.FAMILY,
};
