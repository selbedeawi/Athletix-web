import { Component } from '@angular/core';
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
import { SessionsFilterComponent } from "./components/sessions-filters/sessions-filter.component";

@Component({
  selector: 'app-sessions-list',
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
    SessionsFilterComponent,
  ],
  templateUrl: './sessions-list.component.html',
  styleUrl: './sessions-list.component.scss'
})
export class SessionsListComponent {
  translationTemplate: TranslationTemplates = TranslationTemplates.SESSIONS;
APP_ROUTES = APP_ROUTES;

  
}
