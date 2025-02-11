import { inject, Injectable } from "@angular/core";
import { BehaviorSubject, filter, Observable, take } from "rxjs";
import { BasicAccount } from "../../../shared/models/basic-account-model";
import { Router } from "@angular/router";
import { SupabaseService } from "../supabase/supabase.service";

@Injectable({
  providedIn: "root",
})
export class UserService {
  private supabaseService = inject(SupabaseService);
  // A BehaviorSubject to hold the current user (or null if not logged in)
  private userSubject = new BehaviorSubject<BasicAccount | null>(null);
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
          if (session?.user) {
            // If there is a session, fetch the account details from the "accounts" table
            const { data: account, error } = await this.supabaseService.supabase
              .from("accounts")
              .select()
              .eq("id", session.user.id)
              .single();

            console.log(account);

            if (error) {
              console.error("Error fetching account data:", error.message);
              this.userSubject.next(null);
            } else {
              this.userSubject.next(account as BasicAccount);
            }
            this.initializedSubject.next(true);
          } else {
            // If there is no session, clear the user state
            this.userSubject.next(null);
            this.initializedSubject.next(true);
          }
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
      const { data: account, error } = await this.supabaseService.supabase
        .from("accounts")
        .select()
        .eq("id", session.user.id)
        .single();
      if (error) {
        console.error("Error fetching account data:", error.message);
        this.userSubject.next(null);
      } else {
        this.userSubject.next(account as BasicAccount);
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
  get currentUser(): BasicAccount | null {
    return this.userSubject.value;
  }

  /**
   * Logs out the user, clears the current user state,
   * and navigates to the login page.
   */
  async logout(): Promise<void> {
    await this.supabaseService.signOut();
    this.userSubject.next(null);
    this.router.navigate(["/login"]);
  }
}
