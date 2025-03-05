import { Route } from "@angular/router";
import { APP_ROUTES } from "../../core/enums/pages-urls-enum";

export default [
  {
    path: "",
    loadComponent: () =>
      import(
        "./sessions-list.component"
      ).then((c) => c.SessionsListComponent),
    // canActivate: [authGuard],
  },
  {
    path: APP_ROUTES.ADD_SESSION,
    loadComponent: () =>
      import(
        "./components/add-session/add-session.component"
      ).then((c) => c.AddSessionComponent),
    // canActivate: [authGuard],
  },
  {
    path: `${APP_ROUTES.SESSION_EDIT}/:id`,
    loadComponent: () =>
      import(
        "./components/add-session/add-session.component"
      ).then((c) => c.AddSessionComponent),
    // canActivate: [authGuard],
  },
] satisfies Route[];
