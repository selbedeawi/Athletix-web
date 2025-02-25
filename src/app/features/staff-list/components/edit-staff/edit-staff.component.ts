import { AsyncPipe } from "@angular/common";
import { Component, inject, input, signal } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { MatButtonModule } from "@angular/material/button";
import { MatCardModule } from "@angular/material/card";
import { MatDivider } from "@angular/material/divider";
import { MatIcon } from "@angular/material/icon";
import { Router, RouterLink } from "@angular/router";
import { TranslocoDirective } from "@jsverse/transloco";
import { APP_ROUTES } from "../../../../core/enums/pages-urls-enum";
import { LookupService } from "../../../../core/services/lookup/lookup.service";
import { SnackbarService } from "../../../../core/services/snackbar/snackbar.service";
import { TranslationTemplates } from "../../../../shared/enums/translation-templates-enum";
import { BridgesInputType } from "../../../../shared/ui-components/atoms/input/enum/bridges-input-type.enum";
import { InputComponent } from "../../../../shared/ui-components/atoms/input/input.component";
import { SelectComponent } from "../../../../shared/ui-components/atoms/select/select.component";
import { StaffAccount } from "../../models/staff";
import { StaffService } from "../../services/staff.service";

@Component({
  selector: "app-edit-staff",
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
  templateUrl: "./edit-staff.component.html",
  styleUrl: "./edit-staff.component.scss",
})
export class EditStaffComponent {
  translationTemplate = TranslationTemplates.STAFF;
  APP_ROUTES = APP_ROUTES;
  private staffService = inject(StaffService);
  private snackbarService = inject(SnackbarService);
  private router = inject(Router);
  staffAccount = signal(new StaffAccount("Receptionist"));
  bridgesInputType = BridgesInputType;
  lookupService = inject(LookupService);
  id = input.required<string>();
  cloneStaff = new StaffAccount("Receptionist");
  constructor() {}
  ngOnInit(): void {
    this.staffService.getStaff(this.id()).subscribe((res) => {
      this.staffAccount.set(res);
      this.cloneStaff = structuredClone(res);
    });
  }

  updateStaff() {
    this.staffService
      .updateStaffWithBranches(
        this.staffAccount().id,
        this.staffAccount(),
        this.staffAccount().branchIds,
      )
      .subscribe((res) => {
        if (!res.error) {
          this.snackbarService.success("EDIT_STAFF_SUCCESS");
          this.router.navigate([
            "/",
            APP_ROUTES.STAFF_LIST,
          ]);
        }
      });
  }
  toggleActivate(e: boolean) {
    this.cloneStaff.isActive = e;
    this.staffService
      .updateStaffWithBranches(
        this.cloneStaff.id,
        this.cloneStaff,
        this.cloneStaff.branchIds,
      )
      .subscribe((res) => {
        if (!res.error) {
          this.snackbarService.success("EDIT_STAFF_SUCCESS");
          this.router.navigate([
            "/",
            APP_ROUTES.STAFF_LIST,
          ]);
        }
      });
  }
}
