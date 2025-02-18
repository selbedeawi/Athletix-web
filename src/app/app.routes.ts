import { Routes } from "@angular/router";
import { APP_ROUTES } from "./core/enums/pages-urls-enum";
import { RoleGuard } from "./core/guards/role-guard/role-guard.guard";
import { AccountType } from "./core/enums/account-type-enum";
import { LoginGuard } from "./core/guards/login-guard/login.guard";

export const routes: Routes = [
  { path: "", redirectTo: APP_ROUTES.LOGIN, pathMatch: "full" },
  {
    path: APP_ROUTES.AUTH,
    loadChildren: () => import("./features/auth/auth.routes"),
    data: { layout: "auth" },
    canActivate: [LoginGuard],
  },
  {
    path: APP_ROUTES.ADMIN_DASHBOARD,
    loadComponent: () =>
      import("./features/dashboard/dashboard.component").then(
        (c) => c.DashboardComponent,
      ),
    data: { layout: "main" },
    canActivate: [RoleGuard(["SuperAdmin"])],
  },
  {
    path: APP_ROUTES.MEMBERS_LIST,

    loadComponent: () =>
      import("./features/members-list/members-list.component").then(
        (c) => c.MembersListComponent,
      ),

    data: { layout: "main" },
    canActivate: [
      RoleGuard([
        "SuperAdmin",
        "Sales",
        "Receptionist",
        "SalesManager",
      ]),
    ],
  },
  {
    path: APP_ROUTES.STAFF_LIST,
    loadChildren: () => import("./features/staff-list/staff.routes"),

    data: { layout: "main" },
    canActivate: [RoleGuard(["SuperAdmin"])],
  },
  {
    path: APP_ROUTES.SESSIONS_LIST,
    loadComponent: () =>
      import("./features/sessions-list/sessions-list.component").then(
        (c) => c.SessionsListComponent,
      ),
    data: { layout: "main" },
    canActivate: [
      RoleGuard(["SuperAdmin", "SessionManager"]),
    ],
  },
  {
    path: APP_ROUTES.SCHEDULE_MANAGEMENT,
    loadComponent: () =>
      import("./features/schedule-management/schedule-management.component")
        .then(
          (c) => c.ScheduleManagementComponent,
        ),
    data: { layout: "main" },
    canActivate: [
      RoleGuard(["SuperAdmin", "SessionManager"]),
    ],
  },
  {
    path: APP_ROUTES.BOOKED_SESSIONS,
    loadComponent: () =>
      import("./features/booked-sessions/booked-sessions.component").then(
        (c) => c.BookedSessionsComponent,
      ),
    data: { layout: "main" },
    canActivate: [
      RoleGuard([
        "SuperAdmin",
        "Receptionist",
        "SessionManager",
        "Coach",
      ]),
    ],
  },
  {
    path: "playground",
    loadComponent: () =>
      import("./features/ui-playground/ui-playground.component").then(
        (m) => m.UiPlaygroundComponent,
      ),
    data: { layout: "auth" },
  },
  { path: "**", redirectTo: APP_ROUTES.AUTH, pathMatch: "full" },
];
