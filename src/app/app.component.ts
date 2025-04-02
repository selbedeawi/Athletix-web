import { Component, inject } from "@angular/core";
import {
  ActivatedRoute,
  NavigationEnd,
  Router,
  RouterOutlet,
} from "@angular/router";
import { GlobalLoaderComponent } from "./core/components/global-loader/global-loader.component";
import { AuthLayoutComponent } from "./core/layouts/auth-layout/auth-layout.component";
import { MainLayoutComponent } from "./core/layouts/main-layout/main-layout.component";
import { filter, map } from "rxjs";
import { UserService } from "./core/services/user/user.service";
import { SupabaseService } from "./core/services/supabase/supabase.service";
import { AsyncPipe } from "@angular/common";

@Component({
  selector: "app-root",
  imports: [
    RouterOutlet,
    GlobalLoaderComponent,
    AuthLayoutComponent,
    MainLayoutComponent,
    AsyncPipe,
  ],
  templateUrl: "./app.component.html",
  styleUrl: "./app.component.scss",
})
export class AppComponent {
  title = "athletix";
  public supabaseService = inject(SupabaseService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  public userService = inject(UserService);
  layout: "main" | "auth" = "auth"; // Default layout

  constructor() {
    console.log(window.location.href);
    // if (!!this.userService.getUserId()) this.userService.fetchUserData();
    https:
    //localhost:4702/auth/reset#access_token=eyJhbGciOiJIUzI1NiIsImtpZCI6InVZS0tRSFVCQWFFaEVmNmsiLCJ0eXAiOiJKV1QifQ.eyJpc3MiOiJodHRwczovL2h0dmF3b3J2d3p0aWltcW1jbW5jLnN1cGFiYXNlLmNvL2F1dGgvdjEiLCJzdWIiOiI0MzQ4ZjYyZS0xYjg0LTQ3NmItYmEwMS05YjhjYmJhNzcwOGIiLCJhdWQiOiJhdXRoZW50aWNhdGVkIiwiZXhwIjoxNzQzNjI2MjExLCJpYXQiOjE3NDM2MjI2MTEsImVtYWlsIjoibW9oYW1tZWR6ZWxyYWlzMCtmMUBnbWFpbC5jb20iLCJwaG9uZSI6IiIsImFwcF9tZXRhZGF0YSI6eyJwcm92aWRlciI6ImVtYWlsIiwicHJvdmlkZXJzIjpbImVtYWlsIl19LCJ1c2VyX21ldGFkYXRhIjp7ImVtYWlsX3ZlcmlmaWVkIjp0cnVlLCJyb2xlIjoiUmVjZXB0aW9uaXN0In0sInJvbGUiOiJhdXRoZW50aWNhdGVkIiwiYWFsIjoiYWFsMSIsImFtciI6W3sibWV0aG9kIjoib3RwIiwidGltZXN0YW1wIjoxNzQzNjIyNjExfV0sInNlc3Npb25faWQiOiI3NTVlN2ZiOC1jZGIwLTQxNzgtYjRlOS00ODcxMzE3NzNhNzUiLCJpc19hbm9ueW1vdXMiOmZhbHNlfQ.lgDsrW9GKn739SDA91d0EqdTKvkKUqqoN3us6G2zhaw&expires_at=1743626211&expires_in=3600&refresh_token=gPnEzHONzjlSY4FHT2g15Q&token_type=bearer&type=recovery
    this.router.events
      .pipe(
        filter((event) => event instanceof NavigationEnd),
        map(() => this.route.snapshot.firstChild || this.route),
        map((route: any) => route.data["layout"]),
      )
      .subscribe((layout) => {
        this.layout = layout;
      });
  }
}
