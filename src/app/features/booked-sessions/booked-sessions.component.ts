import { Component, inject, viewChild } from "@angular/core";
import { BookSessionsFillterComponent } from "./components/book-sessions-fillter/book-sessions-fillter.component";
import { MatCard, MatCardContent } from "@angular/material/card";
import { MatDivider, MatDividerModule } from "@angular/material/divider";
import { TranslocoDirective } from "@jsverse/transloco";
import { MatButtonModule } from "@angular/material/button";
import { MatPaginator } from "@angular/material/paginator";
import { EmptyResultComponent } from "../../shared/ui-components/templates/empty-result/empty-result.component";
import { TranslationTemplates } from "../../shared/enums/translation-templates-enum";
import { APP_ROUTES } from "../../core/enums/pages-urls-enum";
import { TimeFormatPipe } from "./time-format.pipe";
import { BookedSessionsService } from "./services/booked-sessions.service";

@Component({
  selector: "app-booked-sessions",
  imports: [
    BookSessionsFillterComponent,
    MatDividerModule,
    MatDivider,
    MatCard,
    MatCardContent,
    TranslocoDirective,
    MatButtonModule,
    MatPaginator,
    EmptyResultComponent,
    TimeFormatPipe,
  ],
  templateUrl: "./booked-sessions.component.html",
  styleUrl: "./booked-sessions.component.scss",
})
export class BookedSessionsComponent {
  private bookedSessionsService = inject(BookedSessionsService);
  sessionsFilter = viewChild(BookSessionsFillterComponent);
  translationTemplate = TranslationTemplates.BOOKED_SESSION;
  APP_ROUTES = APP_ROUTES;

  deleteSession(id: any) {
    this.bookedSessionsService.deleteSession(id).subscribe((res) => {
      console.log(res);
      this.sessionsFilter()?.getAll();
    });
  }
}
