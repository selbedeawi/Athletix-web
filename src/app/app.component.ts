import { Component, inject } from '@angular/core';
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
import { SupabaseService } from './core/services/supabase/supabase.service';
import { AsyncPipe } from '@angular/common';

@Component({
  selector: 'app-root',
  imports: [
    RouterOutlet,
    GlobalLoaderComponent,
    AuthLayoutComponent,
    MainLayoutComponent,
    AsyncPipe,
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {
  title = 'athletix';
  public supabaseService = inject(SupabaseService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  public userService = inject(UserService);
  layout: 'main' | 'auth' = 'auth'; // Default layout

  constructor() {
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
