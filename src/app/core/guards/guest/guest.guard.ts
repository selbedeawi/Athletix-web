import { CanActivateFn, Router } from '@angular/router';
import { APP_ROUTES } from '../../enums/pages-urls-enum';
import { inject } from '@angular/core';
import { AuthService } from '../../services/auth/auth.service';
import { UserService } from '../../services/user/user.service';
import { combineLatest, map } from 'rxjs';
import { roleRouteMapping } from '../../../shared/models/auth.model';

export const guestGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);
  const userService = inject(UserService);

  return combineLatest([
    authService.isLoggedIn$,
    userService.currentUser$,
  ]).pipe(
    map(([isLoggedIn, user]) => {
      if (isLoggedIn && user) {
        const userRole = user?.role;
        const route = roleRouteMapping[userRole];

        if (route) {
          router.navigate([route]);
        } else {
          console.error('No route defined for this role:', userRole);
        }
        return false;
      } else {
        // User is not logged in, allow access to the route
        return true;
      }
    })
  );
};
