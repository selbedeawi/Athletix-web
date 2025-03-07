import { inject, Injectable } from "@angular/core";
import { BehaviorSubject, filter, Observable, take } from "rxjs";

import { Router } from "@angular/router";
import { SupabaseService } from "../supabase/supabase.service";
import { StaffAccount } from "../../../features/staff-list/models/staff";
import { APP_ROUTES } from "../../enums/pages-urls-enum";

@Injectable({
  providedIn: "root",
})
export class UserService {
  private supabaseService = inject(SupabaseService);
  // A BehaviorSubject to hold the current user (or null if not logged in)
  private userSubject = new BehaviorSubject<StaffAccount | null>(null);
  // Expose the user as an observable for components to subscribe to
  public currentUser$ = this.userSubject.asObservable();

  // A subject to signal when initialization is complete.
  private initializedSubject = new BehaviorSubject<boolean>(false);
  public initialized$ = this.initializedSubject.asObservable();

  private router = inject(Router);

  constructor() {
    this.supabaseService.isSupabaseReady.pipe(
      filter((res) => !!res),
      take(1),
    ).subscribe((res) => {
      if (res) {
        this.initializeUser();

        // Subscribe to Supabase auth state changes.
        // This will update the user state whenever the authentication changes.
        this.supabaseService.authChanges(async (_event, session) => {
          setTimeout(async () => {
            if (session?.user) {
              // If there is a session, fetch the account details from the "accounts" table
              const { data: account, error } = await this.supabaseService.sb
                .from("Staff")
                .select()
                .eq("id", session.user.id)
                .single();

              if (error) {
                console.error("Error fetching account data:", error.message);
                this.userSubject.next(null);
              } else {
                this.userSubject.next(account as StaffAccount);
              }
              this.initializedSubject.next(true);
            } else {
              // If there is no session, clear the user state
              this.userSubject.next(null);
              this.initializedSubject.next(true);
            }
          }, 0);

          // Mark initialization as complete after each auth change.
        });
        // Initialize the user (check for an existing session)
      }
    });
  }

  /**
   * Checks for an existing session and, if present,
   * fetches the account data from the "accounts" table.
   */
  async initializeUser(): Promise<void> {
    const session = await this.supabaseService.getSession();
    if (session?.user) {
      const { data: account, error } = await this.supabaseService.sb
        .from("Staff")
        .select()
        .eq("id", session.user.id)
        .single();
      if (error) {
        console.error("Error fetching account data:", error.message);
        this.userSubject.next(null);
      } else {
        this.userSubject.next(account as StaffAccount);
      }
      this.initializedSubject.next(true);
    } else {
      this.userSubject.next(null);
      this.initializedSubject.next(true);
    }
  }

  /**
   * Synchronously returns the latest value of the current user.
   */
  get currentUser(): StaffAccount | null {
    return this.userSubject.value;
  }

  /**
   * Logs out the user, clears the current user state,
   * and navigates to the login page.
   */
  async logout(): Promise<void> {
    await this.supabaseService.signOut();
    this.userSubject.next(null);
    this.router.navigate(["/", APP_ROUTES.AUTH, APP_ROUTES.LOGIN]);
  }
}
