import { Component, inject, signal } from "@angular/core";
import { Router, RouterLink } from "@angular/router";
import { APP_ROUTES } from "../../../../core/enums/pages-urls-enum";
import { SnackbarService } from "../../../../core/services/snackbar/snackbar.service";
import { StaffAccount } from "../../models/staff";
import { StaffService } from "../../services/staff.service";
import { FormsModule } from "@angular/forms";
import { MatIcon } from "@angular/material/icon";
import { MatDivider } from "@angular/material/divider";
import { MatCardModule } from "@angular/material/card";
import { InputComponent } from "../../../../shared/ui-components/atoms/input/input.component";
import { BridgesInputType } from "../../../../shared/ui-components/atoms/input/enum/bridges-input-type.enum";
import { TranslationTemplates } from "../../../../shared/enums/translation-templates-enum";
import { TranslocoDirective } from "@jsverse/transloco";
import { MatButtonModule } from "@angular/material/button";
import { SelectComponent } from "../../../../shared/ui-components/atoms/select/select.component";
import { LookupService } from "../../../../core/services/lookup/lookup.service";
import { AsyncPipe } from "@angular/common";

@Component({
  selector: "app-add-staff",
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
  ],
  templateUrl: "./add-staff.component.html",
  styleUrl: "./add-staff.component.scss",
})
export class AddStaffComponent {
  translationTemplate = TranslationTemplates.STAFF;
  APP_ROUTES = APP_ROUTES;
  private staffService = inject(StaffService);
  private snackbarService = inject(SnackbarService);
  private router = inject(Router);
  staffAccount = signal(new StaffAccount("Receptionist"));
  bridgesInputType = BridgesInputType;
  lookupService = inject(LookupService);
  constructor() {}
  ngOnInit(): void {}

  addStaff() {
    const clone = structuredClone(this.staffAccount());
    clone.password = this.generateRandomPassword(
      clone.firstName,
      clone.lastName,
    );

    this.staffService
      .createStaffAccount(clone)
      .subscribe((res) => {
        if (!res.error) {
          this.snackbarService.success("ADD_STAFF_SUCCESS");
          this.router.navigate([
            "/",
            APP_ROUTES.STAFF_LIST,
          ]);
        }
      });
  }
  generateRandomPassword(
    first: string,
    last: string,
    length: number = 6,
  ): string {
    // Ensure length is within bounds.
    length = Math.max(8, Math.min(36, length));

    const digits = "0123456789";

    // Combine allowed characters (exclude space).
    const all = digits;

    // Guarantee at least one lower and one upper.
    let password = "";
    password += first.trim()[0].toUpperCase();
    password += last.trim()[0].toLowerCase();

    // Fill remaining characters.
    for (let i = 2; i < length; i++) {
      password += all[Math.floor(Math.random() * all.length)];
    }

    // Shuffle the characters to randomize positions.
    return password.split("").sort(() => 0.5 - Math.random()).join("");
  }
}
