import { Routes } from '@angular/router';
import { APP_ROUTES } from './core/enums/pages-urls-enum';
import { guestGuard } from './core/guards/guest/guest.guard';

export const routes: Routes = [
  { path: '', redirectTo: APP_ROUTES.LOGIN, pathMatch: 'full' },
  {
    path: APP_ROUTES.AUTH,
    loadChildren: () => import('./features/auth/auth.routes'),

    data: { layout: 'auth' },
    canActivate: [guestGuard],
  },
  {
    path: 'playground',
    loadComponent: () =>
      import('./features/ui-playground/ui-playground.component').then(
        (m) => m.UiPlaygroundComponent
      ),
    data: { layout: 'auth' },
  },
];
