import { Component } from "@angular/core";
import { MatButtonModule } from "@angular/material/button";
import { MatCard, MatCardContent } from "@angular/material/card";
import { MatDivider } from "@angular/material/divider";
import { MatIcon } from "@angular/material/icon";
import { MatPaginator } from "@angular/material/paginator";
import { RouterLink } from "@angular/router";
import { TranslocoDirective } from "@jsverse/transloco";
import { APP_ROUTES } from "../../core/enums/pages-urls-enum";
import { TranslationTemplates } from "../../shared/enums/translation-templates-enum";
import { EmptyResultComponent } from "../../shared/ui-components/templates/empty-result/empty-result.component";
import { MembershipFilterComponent } from "./components/membership-filter/membership-filter.component";

@Component({
  selector: "app-membership-list",
  imports: [
    MatDivider,
    MatCard,
    MatCardContent,
    TranslocoDirective,
    MatButtonModule,
    MatPaginator,
    EmptyResultComponent,
    RouterLink,
    MatIcon,
    MembershipFilterComponent,
  ],
  templateUrl: "./membership-list.component.html",
  styleUrl: "./membership-list.component.scss",
})
export class MembershipListComponent {
  translationTemplate = TranslationTemplates.MEMBERSHIP;
  APP_ROUTES = APP_ROUTES;
}
