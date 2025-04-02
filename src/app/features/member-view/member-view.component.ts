import { Component, inject } from "@angular/core";
import { MatButtonModule } from "@angular/material/button";
import { MatCardModule } from "@angular/material/card";
import { TranslocoDirective } from "@jsverse/transloco";
import { UserService } from "../../core/services/user/user.service";
import { TranslationTemplates } from "../../shared/enums/translation-templates-enum";
import { AsyncPipe } from "@angular/common";

@Component({
  selector: "app-member-view",
  imports: [MatButtonModule, MatCardModule, TranslocoDirective, AsyncPipe],
  templateUrl: "./member-view.component.html",
  styleUrl: "./member-view.component.scss",
})
export class MemberViewComponent {
  translationTemplate = TranslationTemplates.AUTH;
  userService = inject(UserService);
}
