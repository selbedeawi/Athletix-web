import { inject } from "@angular/core";
import { CanActivateFn, Router } from "@angular/router";

import { combineLatest, filter, map, take } from "rxjs";
import { UserService } from "../../services/user/user.service";
import { roleRouteMapping } from "../../../shared/models/auth.model";
import { APP_ROUTES } from "../../enums/pages-urls-enum";

export const LoginGuard: CanActivateFn = (route, state) => {
  const userService = inject(UserService);
  const router = inject(Router);

  return combineLatest([userService.currentUser$, userService.initialized$])
    .pipe(
      filter(([_, initialized]) => initialized),
      take(1),
      map(([user]) => {
        if (user) {
          return router.createUrlTree(["/", roleRouteMapping[user.role]]);
        }
        return true;
      }),
    );
};
