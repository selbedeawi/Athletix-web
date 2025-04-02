import { Routes } from "@angular/router";
import { APP_ROUTES } from "./core/enums/pages-urls-enum";
import { RoleGuard } from "./core/guards/role-guard/role-guard.guard";

export const routes: Routes = [
  { path: "", redirectTo: APP_ROUTES.LOGIN, pathMatch: "full" },
  {
    path: APP_ROUTES.AUTH,
    loadChildren: () => import("./features/auth/auth.routes"),
    data: { layout: "auth" },
  },
  {
    path: APP_ROUTES.MEMBER_VIEW,
    loadComponent: () =>
      import("./features/member-view/member-view.component").then(
        (c) => c.MemberViewComponent,
      ),
    data: { layout: "auth" },
    canActivate: [RoleGuard(["Member"])],
  },
  {
    path: APP_ROUTES.ADMIN_DASHBOARD,
    loadComponent: () =>
      import("./features/dashboard/dashboard.component").then(
        (c) => c.DashboardComponent,
      ),
    data: { layout: "main" },
    canActivate: [RoleGuard([])],
  },
  {
    path: APP_ROUTES.MEMBERSHIP_LIST,
    loadChildren: () => import("./features/membership-list/membership.routes"),
    data: { layout: "main" },
    canActivate: [RoleGuard(["SuperAdmin"])],
  },
  {
    path: APP_ROUTES.MEMBERS_LIST,
    loadChildren: () => import("./features/members-list/membership.routes"),
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
    loadChildren: () => import("./features/sessions-list/sessions.routes"),
    data: { layout: "main" },
    canActivate: [
      RoleGuard(["SuperAdmin"]),
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
      RoleGuard(["SuperAdmin", "SessionManager", "Receptionist", "Coach"]),
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
    path: APP_ROUTES.PT_SESSIONS,
    loadComponent: () =>
      import("./features/PT-Sessions/pt-sessions.component").then(
        (c) => c.PtSessionsComponent,
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
    data: { layout: "main" },
  },
  { path: "**", redirectTo: APP_ROUTES.AUTH, pathMatch: "full" },
];
