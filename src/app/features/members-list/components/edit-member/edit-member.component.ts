import { Component, inject, input, signal } from "@angular/core";
import {
  ActivatedRoute,
  RouterLink,
  RouterModule,
  Routes,
} from "@angular/router";
import { TranslocoDirective } from "@jsverse/transloco";
import { APP_ROUTES } from "../../../../core/enums/pages-urls-enum";
import { TranslationTemplates } from "../../../../shared/enums/translation-templates-enum";

import { MatTabsModule } from "@angular/material/tabs";
import { MatIcon } from "@angular/material/icon";
import { MatButtonModule } from "@angular/material/button";

export interface NavLink {
  route: string;
  label: string;
}

@Component({
  selector: "app-edit-member",
  imports: [
    TranslocoDirective,
    RouterLink,
    MatTabsModule,
    RouterModule,
    MatIcon,
    MatButtonModule,
  ],
  templateUrl: "./edit-member.component.html",
  styleUrl: "./edit-member.component.scss",
})
export class EditMemberComponent {
  translationTemplates = TranslationTemplates.MEMBER;
  private route = inject(ActivatedRoute);
  navLinks: NavLink[] = [];
  APP_ROUTES = APP_ROUTES;
  isLoading = signal(false);
  id = input.required<string>();
  constructor() {
    this.navLinks = this.route.routeConfig && this.route.routeConfig.children
      ? this.buildNavItems(this.route.routeConfig.children)
      : [];
  }
  buildNavItems(routes: Routes): NavLink[] {
    return routes
      .filter((route) => route.data)
      .map(({ path = "", data }) => ({
        route: path,
        label: data?.["label"] || "",
      }));
  }
}
