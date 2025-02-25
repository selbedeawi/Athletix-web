import { Route } from "@angular/router";
import { APP_ROUTES } from "../../core/enums/pages-urls-enum";
import { authGuard } from "../../core/guards/auth/auth.guard";

export default [
  { path: "", redirectTo: APP_ROUTES.STAFF_LIST, pathMatch: "full" },
  {
    path: APP_ROUTES.STAFF_LIST,
    loadComponent: () =>
      import(
        "./staff-list.component"
      ).then((c) => c.StaffListComponent),
    // canActivate: [authGuard],
  },
  {
    path: APP_ROUTES.ADD_STAFF,
    loadComponent: () =>
      import(
        "./components/add-staff/add-staff.component"
      ).then((c) => c.AddStaffComponent),
    // canActivate: [authGuard],
  },
  {
    path: `${APP_ROUTES.STAFF_EDIT}/:id`,
    loadComponent: () =>
      import(
        "./components/edit-staff/edit-staff.component"
      ).then((c) => c.EditStaffComponent),
    // canActivate: [authGuard],
  },
] satisfies Route[];
