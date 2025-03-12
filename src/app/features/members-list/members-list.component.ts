import { Component } from "@angular/core";
import { MemberFilterComponent } from "./components/member-filter/member-filter.component";
import { EmptyResultComponent } from "../../shared/ui-components/templates/empty-result/empty-result.component";
import { MatButtonModule } from "@angular/material/button";
import { MatCard, MatCardContent } from "@angular/material/card";
import { MatDivider } from "@angular/material/divider";
import { MatIcon } from "@angular/material/icon";
import { MatPaginator } from "@angular/material/paginator";
import { RouterLink } from "@angular/router";
import { TranslocoDirective } from "@jsverse/transloco";
import { TranslationTemplates } from "../../shared/enums/translation-templates-enum";
import { APP_ROUTES } from "../../core/enums/pages-urls-enum";

@Component({
  selector: "app-members-list",
  imports: [
    MemberFilterComponent,
    MatDivider,
    MatCard,
    MatCardContent,
    TranslocoDirective,
    MatButtonModule,
    MatPaginator,
    EmptyResultComponent,
    RouterLink,
    MatIcon,
  ],
  templateUrl: "./members-list.component.html",
  styleUrl: "./members-list.component.scss",
})
export class MembersListComponent {
  translationTemplate = TranslationTemplates.MEMBER;
  APP_ROUTES = APP_ROUTES;
}
