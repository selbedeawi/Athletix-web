import {
  ChangeDetectionStrategy,
  Component,
  inject,
  signal,
} from '@angular/core';
import { FooterComponent } from '../../components/footer/footer.component';
import { BrdgsSidenavComponent } from '../../components/sidebar/sidebar.component';
import { HeaderComponent } from '../../components/header/header.component';
import { BreakpointObserver, BreakpointState } from '@angular/cdk/layout';
import {
  animate,
  state,
  style,
  transition,
  trigger,
} from '@angular/animations';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatIcon, MatIconModule } from '@angular/material/icon';
import { NgClass } from '@angular/common';
import { MatIconButton } from '@angular/material/button';
@Component({
  selector: 'app-main-layout',
  imports: [
    BrdgsSidenavComponent,
    NgClass,
    MatIcon,
    MatIconModule,
    MatSidenavModule,
    FooterComponent,
    HeaderComponent,
    MatIconButton,
  ],
  templateUrl: './main-layout.component.html',
  styleUrl: './main-layout.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: [
    trigger('sidebarAnimation', [
      state(
        'expanded',
        style({
          width: '260px',
        })
      ),
      state(
        'collapsed',
        style({
          width: '84px',
        })
      ),
      transition('expanded <=> collapsed', [animate('200ms ease-in-out')]),
    ]),
    trigger('sideContentAnimation', [
      state(
        'expanded',
        style({
          'margin-left': '260px',
        })
      ),
      state(
        'collapsed',
        style({
          'margin-left': '84px',
        })
      ),
      state(
        'closed',
        style({
          'margin-left': '0px',
        })
      ),
      transition('expanded <=> collapsed', [animate('200ms ease-in-out')]),
    ]),
    trigger('sideBtnAnimation', [
      state(
        'expanded',
        style({
          left: '238px',
        })
      ),
      state(
        'collapsed',
        style({
          left: '64px',
        })
      ),
      transition('expanded <=> collapsed', [animate('200ms ease-in-out')]),
    ]),
  ],
})
export class MainLayoutComponent {
  public isCollapsed = signal(false);
  public isSidenavOpen = signal(true);

  public currentView = signal<'Laptop' | 'iPad' | 'phone'>('Laptop');
  private breakpointObserver = inject(BreakpointObserver);

  ngOnInit(): void {
    this.breakpointObserver
      .observe(['(min-width: 992px)', '(min-width: 576px)'])
      .subscribe((state: BreakpointState) => {
        if (
          !state.breakpoints['(min-width: 576px)'] &&
          !state.breakpoints['(min-width: 992px)']
        ) {
          this.isSidenavOpen.set(false);
          this.isCollapsed.set(false);
          this.currentView.set('phone');
        } else if (
          state.breakpoints['(min-width: 576px)'] &&
          !state.breakpoints['(min-width: 992px)']
        ) {
          this.isSidenavOpen.set(true);
          this.isCollapsed.set(true);
          this.currentView.set('iPad');
        } else {
          this.isSidenavOpen.set(true);
          this.isCollapsed.set(false);
          this.currentView.set('Laptop');
        }
      });
  }
  public toggleSidebar(): void {
    this.isCollapsed.set(!this.isCollapsed());
  }
}
