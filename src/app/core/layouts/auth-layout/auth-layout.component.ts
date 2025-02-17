import { ChangeDetectionStrategy, Component } from "@angular/core";
import { MatIconModule } from "@angular/material/icon";
import { ChangeLangComponent } from "../../../shared/ui-components/molecules/change-lang/change-lang.component";

@Component({
  selector: "app-auth-layout",
  imports: [MatIconModule],
  templateUrl: "./auth-layout.component.html",
  styleUrl: "./auth-layout.component.scss",
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AuthLayoutComponent {}
