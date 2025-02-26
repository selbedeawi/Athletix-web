import { Route } from "@angular/router";
import { APP_ROUTES } from "../../core/enums/pages-urls-enum";
import { authGuard } from "../../core/guards/auth/auth.guard";

export default [
  {
    path: "",
    loadComponent: () =>
      import(
        "./membership-list.component"
      ).then((c) => c.MembershipListComponent),
    // canActivate: [authGuard],
  },
  {
    path: APP_ROUTES.ADD_MEMBERSHIP,
    loadComponent: () =>
      import(
        "./components/add-membership/add-membership.component"
      ).then((c) => c.AddMembershipComponent),
    // canActivate: [authGuard],
  },
  {
    path: `${APP_ROUTES.MEMBERSHIP_EDIT}/:id`,
    loadComponent: () =>
      import(
        "./components/add-membership/add-membership.component"
      ).then((c) => c.AddMembershipComponent),
    // canActivate: [authGuard],
  },
] satisfies Route[];
