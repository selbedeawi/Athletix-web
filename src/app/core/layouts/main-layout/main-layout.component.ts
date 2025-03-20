import {
  ChangeDetectionStrategy,
  Component,
  inject,
  signal,
} from "@angular/core";
import { BrdgsSidenavComponent } from "../../components/sidebar/sidebar.component";
import { HeaderComponent } from "../../components/header/header.component";
import { BreakpointObserver, BreakpointState } from "@angular/cdk/layout";
import {
  animate,
  state,
  style,
  transition,
  trigger,
} from "@angular/animations";
import { MatSidenavModule } from "@angular/material/sidenav";
import { MatIcon, MatIconModule } from "@angular/material/icon";

@Component({
  selector: "app-main-layout",
  imports: [
    BrdgsSidenavComponent,
    MatIcon,
    MatIconModule,
    MatSidenavModule,
    HeaderComponent,
  ],
  templateUrl: "./main-layout.component.html",
  styleUrl: "./main-layout.component.scss",
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: [
    trigger("sidebarAnimation", [
      state(
        "expanded",
        style({
          width: "266px",
        }),
      ),
      state(
        "collapsed",
        style({
          width: "90px",
        }),
      ),
      transition("expanded <=> collapsed", [animate("200ms ease-in-out")]),
    ]),
    trigger("sideContentAnimation", [
      state(
        "expanded",
        style({
          "margin-left": "266px",
        }),
      ),
      state(
        "collapsed",
        style({
          "margin-left": "90px",
        }),
      ),
      state(
        "closed",
        style({
          "margin-left": "0px",
        }),
      ),
      transition("expanded <=> collapsed", [animate("200ms ease-in-out")]),
    ]),
    trigger("sideBtnAnimation", [
      state(
        "expanded",
        style({
          left: "244px",
        }),
      ),
      state(
        "collapsed",
        style({
          left: "80px",
        }),
      ),
      transition("expanded <=> collapsed", [animate("200ms ease-in-out")]),
    ]),
  ],
})
export class MainLayoutComponent {
  public isCollapsed = signal(false);
  public isSidenavOpen = signal(true);

  public currentView = signal<"Laptop" | "iPad" | "phone">("Laptop");
  private breakpointObserver = inject(BreakpointObserver);

  ngOnInit(): void {
    this.breakpointObserver
      .observe(["(min-width: 992px)", "(min-width: 576px)"])
      .subscribe((state: BreakpointState) => {
        if (
          !state.breakpoints["(min-width: 576px)"] &&
          !state.breakpoints["(min-width: 992px)"]
        ) {
          this.isSidenavOpen.set(false);
          this.isCollapsed.set(false);
          this.currentView.set("phone");
        } else if (
          state.breakpoints["(min-width: 576px)"] &&
          !state.breakpoints["(min-width: 992px)"]
        ) {
          this.isSidenavOpen.set(true);
          this.isCollapsed.set(true);
          this.currentView.set("iPad");
        } else {
          this.isSidenavOpen.set(true);
          this.isCollapsed.set(false);
          this.currentView.set("Laptop");
        }
      });
  }
  public toggleSidebar(): void {
    this.isCollapsed.set(!this.isCollapsed());
  }
}
