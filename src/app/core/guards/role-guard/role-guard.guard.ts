import { CanActivateFn, Router } from "@angular/router";
import { inject } from "@angular/core";
import { combineLatest } from "rxjs";
import { filter, map, take } from "rxjs/operators";
import { UserService } from "../../services/user/user.service";
import { AccountType } from "../../enums/account-type-enum";

export const RoleGuard = (allowedRoles: AccountType[]): CanActivateFn => {
  return (route, state) => {
    const router = inject(Router);
    const userService = inject(UserService);

    // Wait until the user service has finished initializing
    return combineLatest([userService.currentUser$, userService.initialized$])
      .pipe(
        // Only continue when initialization is complete.
        filter(([_, initialized]) => initialized),
        take(1),
        map(([user]) => {
          if (!user) {
            router.navigate(["/login"], {
              queryParams: { returnUrl: state.url },
            });
            return false;
          }

          const userRole = user.role;
          if (allowedRoles.includes(userRole)) {
            return true;
          } else {
            router.navigate(["/not-authorized"]);
            return false;
          }
        }),
      );
  };
};
