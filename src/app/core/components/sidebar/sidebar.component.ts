import { AsyncPipe, NgClass } from "@angular/common";
import {
  Component,
  inject,
  input,
  model,
  OnDestroy,
  signal,
} from "@angular/core";
import { MatButtonModule } from "@angular/material/button";
import { MatDividerModule } from "@angular/material/divider";
import { MatIconModule } from "@angular/material/icon";
import { MatListModule } from "@angular/material/list";
import { FormsModule } from "@angular/forms";
import { SidenavMenuItem } from "./sidebar-menu-items.interface";
import { Router, RouterLinkActive, RouterModule } from "@angular/router";
import { UserService } from "../../services/user/user.service";
import { Subject, takeUntil } from "rxjs";
import { APP_ROUTES } from "../../enums/pages-urls-enum";
import { AccountType } from "../../enums/account-type-enum";
import { TranslocoDirective } from "@jsverse/transloco";
import { TranslationTemplates } from "../../../shared/enums/translation-templates-enum";

import { ChangeLangComponent } from "../../../shared/ui-components/molecules/change-lang/change-lang.component";

@Component({
  selector: "brdgs-sidenav",
  imports: [
    MatIconModule,
    MatButtonModule,
    MatListModule,
    MatDividerModule,

    FormsModule,
    RouterModule,
    TranslocoDirective,
    AsyncPipe,

    RouterLinkActive,
    ChangeLangComponent,
  ],

  templateUrl: "./sidebar.component.html",
  styleUrl: "./sidebar.component.scss",
})
export class BrdgsSidenavComponent implements OnDestroy {
  private router = inject(Router);
  public userService = inject(UserService);

  translationTemplates = TranslationTemplates.SIDE_NAVE;

  APP_ROUTES = APP_ROUTES;

  isCollapsed = model.required<boolean>();
  isSidenavOpen = model.required<boolean>();
  currentView = input.required<"Laptop" | "iPad" | "phone">();
  public sidenavMenuItems = signal<SidenavMenuItem[]>([
    {
      icon: "icon-dashboard_2",
      label: "NAV_ADMIN_DASHBOARD",
      path: ["/", APP_ROUTES.ADMIN_DASHBOARD],
      permissions: ["SuperAdmin"],
    },
    {
      icon: "icon-gmail_groups",
      label: "NAV_MEMBERS_LIST",
      path: ["/", APP_ROUTES.MEMBERS_LIST],
      permissions: [
        "SuperAdmin",
        "Sales",
        "Receptionist",
        "SalesManager",
      ],
    },
    {
      icon: "icon-staff",
      label: "NAV_STAFF_LIST",
      path: ["/", APP_ROUTES.STAFF_LIST],
      permissions: ["SuperAdmin"],
    },
    {
      icon: "icon-staff",
      label: "NAV_MEMBERSHIP_LIST",
      path: ["/", APP_ROUTES.MEMBERSHIP_LIST],
      permissions: ["SuperAdmin"],
    },
    {
      icon: "icon-list",
      label: "NAV_SESSIONS_LIST",
      path: ["/", APP_ROUTES.SESSIONS_LIST],
      permissions: ["SuperAdmin", "SessionManager"],
    },
    {
      icon: "icon-today",
      label: "NAV_SCHEDULE_MANAGEMENT",
      path: ["/", APP_ROUTES.SCHEDULE_MANAGEMENT],
      permissions: ["SuperAdmin", "SessionManager"],
    },
    {
      icon: "icon-bookedsessions",
      label: "NAV_BOOKED_SESSIONS",
      path: ["/", APP_ROUTES.BOOKED_SESSIONS],
      permissions: [
        "SuperAdmin",
        "Receptionist",
        "SessionManager",
        "Coach",
      ],
    },
  ]);

  /**
   * Toggle the sidebar between collapsed and expanded
   */

  destroy$ = new Subject();
  constructor() {
  }

  ngOnDestroy(): void {
    this.destroy$.next(true);
  }
  logout() {
    this.userService.logout();
  }
}
