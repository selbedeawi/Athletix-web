import { Route } from "@angular/router";
import { APP_ROUTES } from "../../core/enums/pages-urls-enum";
import { authGuard } from "../../core/guards/auth/auth.guard";

export default [
  { path: "", redirectTo: APP_ROUTES.LOGIN, pathMatch: "full" },
  {
    path: APP_ROUTES.LOGIN,
    loadComponent: () =>
      import("./login/login.component").then((c) => c.LoginComponent),
  },
  {
    path: `${APP_ROUTES.RESEND_CONFIRM}/:email`,
    loadComponent: () =>
      import("./resend-confirm/resend-confirm.component").then(
        (c) => c.ResendConfirmComponent,
      ),
  },

  {
    path: APP_ROUTES.RESET_PASSWORD,
    loadComponent: () =>
      import("./reset-password/reset-password.component").then(
        (c) => c.ResetPasswordComponent,
      ),
  },
  {
    path: APP_ROUTES.CONFIRM_PASSWORD,
    loadComponent: () =>
      import("./confirm-reset-password/confirm-reset-password.component").then(
        (c) => c.ConfirmResetPasswordComponent,
      ),
  },
] satisfies Route[];
