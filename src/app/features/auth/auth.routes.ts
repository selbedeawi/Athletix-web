import { Route } from "@angular/router";
import { APP_ROUTES } from "../../core/enums/pages-urls-enum";
import { LoginGuard } from "../../core/guards/login-guard/login.guard";
import { RoleGuard } from "../../core/guards/role-guard/role-guard.guard";

export default [
  { path: "", redirectTo: APP_ROUTES.LOGIN, pathMatch: "full" },
  {
    path: APP_ROUTES.LOGIN,
    loadComponent: () =>
      import("./login/login.component").then((c) => c.LoginComponent),
    canActivate: [LoginGuard],
  },
  {
    path: `${APP_ROUTES.RESEND_CONFIRM}/:email`,
    loadComponent: () =>
      import("./member-pass-confirm/member-pass-confirm.component").then(
        (c) => c.MemberPassConfirmComponent,
      ),
    canActivate: [LoginGuard],
  },

  {
    path: APP_ROUTES.RESET_PASSWORD,
    loadComponent: () =>
      import("./reset-password/reset-password.component").then(
        (c) => c.ResetPasswordComponent,
      ),
    canActivate: [LoginGuard],
  },
  {
    path: APP_ROUTES.CONFIRM_PASSWORD,
    loadComponent: () =>
      import("./confirm-reset-password/confirm-reset-password.component").then(
        (c) => c.ConfirmResetPasswordComponent,
      ),
  },
] satisfies Route[];
