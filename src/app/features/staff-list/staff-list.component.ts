import { Component, inject, signal } from "@angular/core";
import { APP_ROUTES } from "../../core/enums/pages-urls-enum";
import { MatButtonModule } from "@angular/material/button";
import { MatCard, MatCardContent } from "@angular/material/card";
import { MatDivider } from "@angular/material/divider";
import { MatIcon } from "@angular/material/icon";
import { MatPaginator } from "@angular/material/paginator";
import { Router, RouterLink } from "@angular/router";
import { TranslocoDirective } from "@jsverse/transloco";
import { NgxMaskPipe } from "ngx-mask";
import { TranslationTemplates } from "../../shared/enums/translation-templates-enum";
import { StaffService } from "./services/staff.service";
import { SnackbarService } from "../../core/services/snackbar/snackbar.service";
import { StaffAccount } from "./models/staff";

@Component({
  selector: "app-staff-list",
  imports: [
    MatDivider,
    MatCard,
    MatCardContent,
    TranslocoDirective,
    MatButtonModule,
    // MatPaginator,
    // EmptyResultComponent,
    RouterLink,
    // NgxMaskPipe,
    // MatIcon,
  ],
  templateUrl: "./staff-list.component.html",
  styleUrl: "./staff-list.component.scss",
})
export class StaffListComponent {
  translationTemplate = TranslationTemplates.STAFF;
  APP_ROUTES = APP_ROUTES;
}
