import { ChangeDetectionStrategy, Component, inject } from "@angular/core";
import { ActivatedRoute, Router, RouterLink } from "@angular/router";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { MatButtonModule } from "@angular/material/button";
import { MatInputModule } from "@angular/material/input";
import { MatCardModule } from "@angular/material/card";
import { InputComponent } from "../../../shared/ui-components/atoms/input/input.component";
import { BridgesInputType } from "../../../shared/ui-components/atoms/input/enum/bridges-input-type.enum";

import { filter, take } from "rxjs";
import { roleRouteMapping } from "../../../shared/models/auth.model";
import { APP_ROUTES } from "../../../core/enums/pages-urls-enum";
import { TranslationTemplates } from "../../../shared/enums/translation-templates-enum";
import { TranslocoDirective } from "@jsverse/transloco";
import { SnackbarService } from "../../../core/services/snackbar/snackbar.service";
import { SupabaseService } from "../../../core/services/supabase/supabase.service";
import { AccountType } from "../../../core/enums/account-type-enum";
import { UserService } from "../../../core/services/user/user.service";

export class LoginCredentials {
  email!: string;
  password!: string;
  confirmPassword?: string;
}

@Component({
  selector: "app-login",
  imports: [
    MatButtonModule,
    MatInputModule,
    MatCardModule,
    ReactiveFormsModule,
    InputComponent,
    FormsModule,
    RouterLink,
    TranslocoDirective,
  ],
  templateUrl: "./login.component.html",
  styleUrls: ["./login.component.scss"],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LoginComponent {
  bridgesInputType = BridgesInputType;
  form: LoginCredentials = {
    email: "",
    password: "",
  };

  router = inject(Router);

  userService = inject(UserService);
  route = inject(ActivatedRoute);
  snackbarService = inject(SnackbarService);
  supabaseService = inject(SupabaseService);
  APP_ROUTES = APP_ROUTES;
  translationTemplate = TranslationTemplates.AUTH;
  verifyEmailToken: string = "";
  userId: string = "";
  ngOnInit(): void {
    // this.verifyEmailToken = this.route.snapshot.paramMap.get("token") || "";
    // this.userId = decodeURIComponent(
    //   this.route.snapshot.queryParamMap.get("userId") || "",
    // );

    // if (this.route.snapshot.paramMap.get("token") && this.userId) {
    //   this.authService
    //     .verifyEmail(this.verifyEmailToken, this.userId)
    //     .subscribe({
    //       next: (response: BEResponse<ILoginRes>) => {
    //         this.snackbarService.success("VERIFY_EMAIL_SUCCESS");
    //       },
    //       error: (error) => {
    //         console.log(error);
    //       },
    //     });
    // }
  }

  login() {
    this.supabaseService.signIn(this.form.email, this.form.password)
      .pipe(take(1))
      .subscribe({
        next: (res) => {
          if (res.data) {
            this.userService.currentUser$.pipe(
              filter((user) => !!user),
              take(1),
            ).subscribe((res) => {
              if (res) {
                const route = roleRouteMapping[res.role];
                if (route) {
                  this.router.navigate(["/", route]);
                } else {
                  console.error("No route defined for this role:", res.role);
                }
              }
            });
          }
        },
        error: (error: any) => {
          // if (
          //   error.error?.errors?.[0]?.errorCode === "USER_EMAIL_NOT_CONFIRMED"
          // ) {
          //   this.router.navigate([
          //     "/",
          //     APP_ROUTES.AUTH,
          //     APP_ROUTES.RESEND_CONFIRM,
          //     encodeURIComponent(this.form.email),
          //   ]);
          // }
        },
      });
  }
}
