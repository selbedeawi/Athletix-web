import { AccountType } from "../../core/enums/account-type-enum";
import { APP_ROUTES } from "../../core/enums/pages-urls-enum";

export const roleRouteMapping: { [key in AccountType]: APP_ROUTES } = {
  ["SuperAdmin"]: APP_ROUTES.MEMBERS_LIST,
  ["SalesManager"]: APP_ROUTES.MEMBERS_LIST,
  ["SessionManager"]: APP_ROUTES.SCHEDULE_MANAGEMENT,
  ["Sales"]: APP_ROUTES.MEMBERS_LIST,
  ["Receptionist"]: APP_ROUTES.MEMBERS_LIST,
  ["Coach"]: APP_ROUTES.BOOKED_SESSIONS,
  ["Member"]: APP_ROUTES.MEMBER_VIEW,
};
