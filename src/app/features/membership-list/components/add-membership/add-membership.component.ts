import { Component, inject, input, signal } from "@angular/core";
import { MembershipService } from "../../services/membership.service";
import { Router, RouterLink } from "@angular/router";
import { APP_ROUTES } from "../../../../core/enums/pages-urls-enum";
import { LookupService } from "../../../../core/services/lookup/lookup.service";
import { SnackbarService } from "../../../../core/services/snackbar/snackbar.service";
import { TranslationTemplates } from "../../../../shared/enums/translation-templates-enum";
import { BridgesInputType } from "../../../../shared/ui-components/atoms/input/enum/bridges-input-type.enum";
import { Memberships } from "../../models/membership";
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

@Component({
  selector: "app-add-membership",
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
  templateUrl: "./add-membership.component.html",
  styleUrl: "./add-membership.component.scss",
})
export class AddMembershipComponent {
  translationTemplate = TranslationTemplates.MEMBERSHIP;
  APP_ROUTES = APP_ROUTES;
  private membershipService = inject(MembershipService);
  private snackbarService = inject(SnackbarService);
  private router = inject(Router);
  membership = signal(new Memberships());
  bridgesInputType = BridgesInputType;
  lookupService = inject(LookupService);
  id = input<string>();
  constructor() {}

  ngOnInit(): void {
    const id = this.id();
    if (id) {
      this.membershipService.getMembership(id).subscribe((res) => {
        this.membership.set(res);
        // this.cloneStaff = structuredClone(res);
      });
    }
  }

  updateMembership() {
    const clone = structuredClone(this.membership());
    delete (clone as any).branchIds;
    delete (clone as any).MembershipBranches;
    this.membershipService
      .updateMembership(
        this.membership().id,
        clone,
        this.membership().branchIds,
      )
      .subscribe((res) => {
        if (!res.error) {
          this.snackbarService.success("EDIT_MEMBERSHIP_SUCCESS");
          this.router.navigate([
            "/",
            APP_ROUTES.MEMBERSHIP_LIST,
          ]);
        }
      });
  }

  addMembership() {
    const clone = structuredClone(this.membership());
    delete (clone as any).branchIds;
    this.membershipService.createMembership(clone, this.membership().branchIds)
      .subscribe(
        (res) => {
          this.snackbarService.success("Membership Added Successfully");
          this.router.navigate([APP_ROUTES.MEMBERSHIP_LIST]);
        },
      );
  }
  onMembershipTypeChange() {
    const type = this.membership().type;
    if (type === "SessionBased" || type === "PrivateCoach") {
      this.membership().numberOfSessions = null;
    } else if (type === "Individual") {
      this.membership().numberOfInvitations = null as any;
      this.membership().numberOfVisits = null as any;
      this.membership().inBodyCount = null as any;
      this.membership().personalTrainerCount = null as any;
      this.membership().hasGroupFitness = null;
      this.membership().hasJacuzzi = null;
      this.membership().hasSteam = null;
      this.membership().hasSunna = null;
    }
  }
}
