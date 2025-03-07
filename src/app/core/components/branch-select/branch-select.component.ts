import { Component, inject, input } from "@angular/core";
import { TranslationTemplates } from "../../../shared/enums/translation-templates-enum";
import { APP_ROUTES } from "../../enums/pages-urls-enum";
import { BranchesService } from "../../services/branches/branches.service";
import { SelectComponent } from "../../../shared/ui-components/atoms/select/select.component";
import { AsyncPipe } from "@angular/common";
import { TranslocoDirective } from "@jsverse/transloco";
import { FormsModule } from "@angular/forms";
import { MatMenuModule } from "@angular/material/menu";
import { MatIcon } from "@angular/material/icon";
import { MatButtonModule } from "@angular/material/button";

@Component({
  selector: "app-branch-select",
  imports: [
    AsyncPipe,
    MatButtonModule,
    MatMenuModule,
    MatIcon,
  ],
  templateUrl: "./branch-select.component.html",
  styleUrl: "./branch-select.component.scss",
})
export class BranchSelectComponent {
  branchesService = inject(BranchesService);
  staffId = input.required<string>();

  constructor() {}
  ngOnInit(): void {
    this.branchesService.getBranches(this.staffId());
  }
}
