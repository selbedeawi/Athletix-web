import {
  ChangeDetectionStrategy,
  Component,
  inject,
  input,
  model,
} from "@angular/core";
import { MatDividerModule } from "@angular/material/divider";
import { MatIconModule } from "@angular/material/icon";
import { MatToolbarModule } from "@angular/material/toolbar";
import { MatMenuModule } from "@angular/material/menu";
import { UserService } from "../../services/user/user.service";
import { AsyncPipe } from "@angular/common";

import { Router } from "@angular/router";
import { NotificationsService } from "../../services/notifications/notifications.service";
import { ChangeLangComponent } from "../../../shared/ui-components/molecules/change-lang/change-lang.component";
import { MatIconButton } from "@angular/material/button";

@Component({
  selector: "app-header",
  imports: [
    MatIconModule,
    MatToolbarModule,
    MatDividerModule,
    MatMenuModule,
    AsyncPipe,
    ChangeLangComponent,
    MatIconButton,
  ],
  providers: [NotificationsService],
  templateUrl: "./header.component.html",
  styleUrl: "./header.component.scss",
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HeaderComponent {
  public userService = inject(UserService);

  public notificationService = inject(NotificationsService);
  private router = inject(Router);

  isSidenavOpen = model.required<boolean>();
  currentView = input.required<"Laptop" | "iPad" | "phone">();

  logout() {
    this.userService.logout();
  }

  // get notifications() {
  //   return this.notificationService.getNotifications().subscribe();
  // }
}
