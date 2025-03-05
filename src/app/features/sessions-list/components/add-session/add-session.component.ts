import { Component, inject, input, signal } from "@angular/core";
import { Router, RouterLink } from "@angular/router";
import { APP_ROUTES } from "../../../../core/enums/pages-urls-enum";
import { LookupService } from "../../../../core/services/lookup/lookup.service";
import { SnackbarService } from "../../../../core/services/snackbar/snackbar.service";
import { TranslationTemplates } from "../../../../shared/enums/translation-templates-enum";
import { BridgesInputType } from "../../../../shared/ui-components/atoms/input/enum/bridges-input-type.enum";
import { Sessions } from "../../models/sessions";
import { AsyncPipe } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { MatButtonModule } from "@angular/material/button";
import { MatCardModule } from "@angular/material/card";
import { MatDivider } from "@angular/material/divider";
import { MatIcon } from "@angular/material/icon";
import { TranslocoDirective } from "@jsverse/transloco";
import { InputComponent } from "../../../../shared/ui-components/atoms/input/input.component";
import { SelectComponent } from "../../../../shared/ui-components/atoms/select/select.component";
import { MatCheckboxModule } from "@angular/material/checkbox";
import { SessionService } from "../../services/session.service";

@Component({
  selector: "app-add-session",
  imports: [
    FormsModule,
    MatIcon,
    MatDivider,
    MatCardModule,
    RouterLink,
    InputComponent,
    TranslocoDirective,
    MatButtonModule,
    SelectComponent,
    AsyncPipe,
    MatCheckboxModule,
  ],
  templateUrl: "./add-session.component.html",
  styleUrl: "./add-session.component.scss",
})
export class AddSessionComponent {
  translationTemplate = TranslationTemplates.SESSIONS;
  APP_ROUTES = APP_ROUTES;
  private sessionService = inject(SessionService);
  private snackbarService = inject(SnackbarService);
  private router = inject(Router);
  session = signal(new Sessions());
  bridgesInputType = BridgesInputType;
  lookupService = inject(LookupService);
  id = input<string>();
  constructor() {}

  ngOnInit(): void {
    const id = this.id();
    if (id) {
      this.sessionService.getSession(id).subscribe((res) => {
        this.session.set(res);
        // this.cloneStaff = structuredClone(res);
      });
    }
  }

  updateSession() {
    const clone = structuredClone(this.session());
    delete (clone as any).branchIds;
    delete (clone as any).SessionBranches;
    this.sessionService
      .updateSession(
        this.session().id,
        clone,
        this.session().branchIds,
      )
      .subscribe((res) => {
        if (!res.error) {
          this.snackbarService.success("EDIT_SESSION_SUCCESS");
          this.router.navigate([
            "/",
            APP_ROUTES.SESSIONS_LIST,
          ]);
        }
      });
  }

  addSession() {
    const clone = structuredClone(this.session());
    delete (clone as any).branchIds;
    console.log(clone);
    this.sessionService.createSession(clone, this.session().branchIds)
      .subscribe(
        (res) => {
          this.snackbarService.success("Session Added Successfully");
          this.router.navigate([APP_ROUTES.SESSIONS_LIST]);
        },
      );
  }
}
