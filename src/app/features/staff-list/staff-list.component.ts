import { Component } from "@angular/core";
import { APP_ROUTES } from "../../core/enums/pages-urls-enum";
import { MatButtonModule } from "@angular/material/button";
import { MatCard, MatCardContent } from "@angular/material/card";
import { MatDivider } from "@angular/material/divider";
import { MatPaginator } from "@angular/material/paginator";
import { RouterLink } from "@angular/router";
import { TranslocoDirective } from "@jsverse/transloco";
import { TranslationTemplates } from "../../shared/enums/translation-templates-enum";
import { StaffFilterComponent } from "./components/staff-filter/staff-filter.component";
import { EmptyResultComponent } from "../../shared/ui-components/templates/empty-result/empty-result.component";
import { MatIcon } from "@angular/material/icon";

@Component({
  selector: "app-staff-list",
  imports: [
    MatDivider,
    MatCard,
    MatCardContent,
    TranslocoDirective,
    MatButtonModule,
    MatPaginator,
    EmptyResultComponent,
    RouterLink,
    StaffFilterComponent,
    MatIcon,
  ],
  templateUrl: "./staff-list.component.html",

  styleUrl: "./staff-list.component.scss",
})
export class StaffListComponent {
  translationTemplate = TranslationTemplates.STAFF;
  APP_ROUTES = APP_ROUTES;
}
