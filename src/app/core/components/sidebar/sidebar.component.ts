import { AsyncPipe, NgClass } from '@angular/common';
import {
  Component,
  inject,
  input,
  model,
  OnDestroy,
  signal,
} from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { FormsModule } from '@angular/forms';
import { SidenavMenuItem } from './sidebar-menu-items.interface';
import { Router, RouterLinkActive, RouterModule } from '@angular/router';
import { UserService } from '../../services/user/user.service';
import { Subject, takeUntil } from 'rxjs';
import { APP_ROUTES } from '../../enums/pages-urls-enum';
import { AccountType } from '../../enums/account-type-enum';
import { TranslocoDirective } from '@jsverse/transloco';
import { TranslationTemplates } from '../../../shared/enums/translation-templates-enum';

import { ChangeLangComponent } from '../../../shared/ui-components/molecules/change-lang/change-lang.component';
import { AuthService } from '../../services/auth/auth.service';

@Component({
  selector: 'brdgs-sidenav',
  imports: [
    MatIconModule,
    MatButtonModule,
    MatListModule,
    MatDividerModule,
    NgClass,
    FormsModule,
    RouterModule,
    TranslocoDirective,
    AsyncPipe,

    RouterLinkActive,
    ChangeLangComponent,
  ],

  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.scss',
})
export class BrdgsSidenavComponent implements OnDestroy {
  private authService = inject(AuthService);
  private router = inject(Router);
  public userService = inject(UserService);

  translationTemplates = TranslationTemplates.SIDE_NAVE;

  accountType = AccountType;
  APP_ROUTES = APP_ROUTES;

  isCollapsed = model.required<boolean>();
  isSidenavOpen = model.required<boolean>();
  currentView = input.required<'Laptop' | 'iPad' | 'phone'>();
  public sidenavMenuItems = signal<SidenavMenuItem[]>([]);

  familySidenavItems: SidenavMenuItem[] = [
    {
      icon: 'icon-dashboard',
      label: 'NAV_FAMILY_DASHBOARD',
      path: ['/', APP_ROUTES.FAMILY, APP_ROUTES.FAMILY_DASHBOARD],
    },
    {
      icon: 'icon-user-square',
      label: 'NAV_FAMILY_PROFILE',
      path: ['/', APP_ROUTES.FAMILY, APP_ROUTES.FAMILY_PROFILE],
    },
    {
      icon: 'icon-Experience-and-Preferences',
      label: 'NAV_FAMILY_MANAGE_PREFERENCES',
      path: ['/', APP_ROUTES.FAMILY, APP_ROUTES.FAMILY_MANAGE_PREFERENCES],
    },
    {
      icon: 'icon-users-01',
      label: 'NAV_FAMILY_ASSOCIATES',
      path: ['/', APP_ROUTES.FAMILY, APP_ROUTES.FAMILY_ASSOCIATES],
    },
    {
      icon: 'icon-book-open-01',
      label: 'NAV_FAMILY_RESOURCES',
      path: ['/', APP_ROUTES.FAMILY, APP_ROUTES.RESOURCE_CENTRE],
    },
  ];

  associateSidenavItems: SidenavMenuItem[] = [
    {
      icon: 'icon-dashboard',
      label: 'NAV_ASSOCIATE_DASHBOARD',
      path: ['/', APP_ROUTES.ASSOCIATE, APP_ROUTES.ASSOCIATE_DASHBOARD],
    },
    {
      icon: 'icon-user-square',
      label: 'NAV_ASSOCIATE_PROFILE',
      path: ['/', APP_ROUTES.ASSOCIATE, APP_ROUTES.ASSOCIATE_PROFILE],
    },
    {
      icon: 'icon-experience',
      label: 'NAV_ASSOCIATE_EXPERIENCE',
      path: ['/', APP_ROUTES.ASSOCIATE, APP_ROUTES.ASSOCIATE_EXPERIENCE],
    },
    {
      icon: 'icon-availability',
      label: 'NAV_ASSOCIATE_AVAILABILITY',
      path: ['/', APP_ROUTES.ASSOCIATE, APP_ROUTES.ASSOCIATE_AVAILABILITY],
    },
    {
      icon: 'icon-users-01',
      label: 'NAV_ASSOCIATE_FAMILIES',
      path: ['/', APP_ROUTES.ASSOCIATE, APP_ROUTES.ASSOCIATE_FAMILIES],
    },

    {
      icon: 'icon-book-open-01',
      label: 'ASSOCIATE_RESOURCE_CENTRE',
      path: ['/', APP_ROUTES.ASSOCIATE, APP_ROUTES.RESOURCE_CENTRE],
    },
  ];

  coordinatorSidenavItems: SidenavMenuItem[] = [
    {
      icon: 'icon-user-square',
      label: 'NAV_COORDINATOR_PROFILE',
      path: ['/', APP_ROUTES.COORDINATOR, APP_ROUTES.COORDINATOR_PROFILE],
    },
    {
      icon: 'icon-clipboard-check',
      label: 'NAV_COORDINATOR_TASKS',
      path: ['/', APP_ROUTES.COORDINATOR, APP_ROUTES.COORDINATOR_TASKS],
    },
    {
      icon: 'icon-users-01',
      label: 'NAV_COORDINATOR_USERS',
      path: ['/', APP_ROUTES.COORDINATOR, APP_ROUTES.COORDINATOR_USERS],
    },
    {
      icon: 'icon-puzzle-piece-02',
      label: 'NAV_COORDINATOR_MATCHING_TOOL',
      path: ['/', APP_ROUTES.COORDINATOR, APP_ROUTES.COORDINATOR_MATCHING_TOOL],
    },

    {
      icon: 'icon-book-open-01',
      label: 'NAV_COORDINATOR_REPORT',
      path: ['/', APP_ROUTES.COORDINATOR, APP_ROUTES.COORDINATOR_REPORT],
    },
  ];

  adminSidenavItems: SidenavMenuItem[] = [
    {
      icon: 'icon-users-01',
      label: 'NAV_ADMIN_COORDINATORS',
      path: ['/', APP_ROUTES.ADMIN, APP_ROUTES.ADMIN_COORDINATORS],
    },
    {
      icon: 'icon-translate-01',
      label: 'NAV_ADMIN_TRANSLATIONS',
      path: ['/', APP_ROUTES.ADMIN, APP_ROUTES.ADMIN_TRANSLATIONS],
    },
  ];

  /**
   * Toggle the sidebar between collapsed and expanded
   */

  destroy$ = new Subject();
  constructor() {
    this.userService.currentUser$
      .pipe(takeUntil(this.destroy$))
      .subscribe((res) => {
        if (!res) return;
        switch (res.role) {
          case AccountType.SuperAdmin:
            this.sidenavMenuItems.set([...this.familySidenavItems]);
            break;
          // case AccountType.COORDINATOR:
          //   this.sidenavMenuItems.set([...this.coordinatorSidenavItems]);
          //   break;
          // case AccountType.ASSOCIATE:
          //   this.sidenavMenuItems.set([...this.associateSidenavItems]);
          //   break;
          // case AccountType.ADMIN:
          //   this.sidenavMenuItems.set([...this.adminSidenavItems]);
          //   break;
          default:
            this.sidenavMenuItems;
        }
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next(true);
  }
  logout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
