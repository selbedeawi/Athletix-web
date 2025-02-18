import { ChangeDetectionStrategy, Component } from "@angular/core";
import { MatDividerModule } from "@angular/material/divider";
import { MatToolbarModule } from "@angular/material/toolbar";
import { TranslationTemplates } from "../../../shared/enums/translation-templates-enum";
import { TranslocoDirective } from "@jsverse/transloco";

@Component({
  selector: "app-footer",
  imports: [MatToolbarModule, MatDividerModule, TranslocoDirective],
  templateUrl: "./footer.component.html",
  styleUrl: "./footer.component.scss",
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FooterComponent {
  // TEST commit 2
  translationTemplate = TranslationTemplates.GLOB;
}
