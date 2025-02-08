import { Component } from '@angular/core';
import {
  ActivatedRoute,
  NavigationEnd,
  Router,
  RouterOutlet,
} from '@angular/router';
import { GlobalLoaderComponent } from './core/components/global-loader/global-loader.component';
import { AuthLayoutComponent } from './core/layouts/auth-layout/auth-layout.component';
import { MainLayoutComponent } from './core/layouts/main-layout/main-layout.component';
import { filter, map } from 'rxjs';
import { UserService } from './core/services/user/user.service';

@Component({
  selector: 'app-root',
  imports: [
    RouterOutlet,
    GlobalLoaderComponent,
    AuthLayoutComponent,
    MainLayoutComponent,
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {
  title = 'athletix';

  layout: 'main' | 'auth' = 'auth'; // Default layout

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    public userService: UserService
  ) {
    if (!!this.userService.getUserId()) this.userService.fetchUserData();
    this.router.events
      .pipe(
        filter((event) => event instanceof NavigationEnd),
        map(() => this.route.snapshot.firstChild || this.route),
        map((route: any) => route.data['layout'])
      )
      .subscribe((layout) => {
        this.layout = layout;
      });
  }
}
