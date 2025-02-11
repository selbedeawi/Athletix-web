import { inject } from "@angular/core";
import { CanActivateFn, Router } from "@angular/router";

import { map } from "rxjs";
import { UserService } from "../../services/user/user.service";

export const authGuard: CanActivateFn = (route, state) => {
  const userService = inject(UserService);
  const router = inject(Router);
  return userService.currentUser$.pipe(
    map((isLoggedIn) => {
      if (!isLoggedIn) {
        return router.createUrlTree(["/login"]);
      }
      return true;
    }),
  );
};
