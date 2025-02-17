import { AccountType } from "../../core/enums/account-type-enum";
import { APP_ROUTES } from "../../core/enums/pages-urls-enum";

export const roleRouteMapping: { [key in AccountType]: APP_ROUTES } = {
  ["SuperAdmin"]: APP_ROUTES.ADMIN_DASHBOARD,
  ["SalesManager"]: APP_ROUTES.SALES_MANAGER,
  ["SessionManager"]: APP_ROUTES.SESSION_MANAGER,
  ["Sales"]: APP_ROUTES.SALES,
  ["Receptionist"]: APP_ROUTES.RECEPTIONIST,
  ["Coach"]: APP_ROUTES.COACH,
  ["Member"]: APP_ROUTES.MEMBER,
};
