import { Route } from "@angular/router";
import { APP_ROUTES } from "../../core/enums/pages-urls-enum";
import { authGuard } from "../../core/guards/auth/auth.guard";

export default [
  {
    path: "",
    loadComponent: () =>
      import(
        "./members-list.component"
      ).then((c) => c.MembersListComponent),
    // canActivate: [authGuard],
  },
  {
    path: APP_ROUTES.MEMBERS_ADD,
    loadComponent: () =>
      import(
        "./components/add-member/add-member.component"
      ).then((c) => c.AddMemberComponent),
    // canActivate: [authGuard],
  },
  {
    path: `${APP_ROUTES.MEMBERSHIP_EDIT}/:id`,
    loadComponent: () =>
      import(
        "./components/edit-member/edit-member.component"
      ).then((c) => c.EditMemberComponent),
    // canActivate: [authGuard],
  },
] satisfies Route[];
