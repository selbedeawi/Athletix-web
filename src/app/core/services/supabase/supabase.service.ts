import { inject, Injectable } from "@angular/core";
import {
  AuthChangeEvent,
  AuthSession,
  createClient,
  Session,
  SupabaseClient,
} from "@supabase/supabase-js";
import { environment } from "../../../../environments/environment";
import { Database } from "../../../../../database.types";

import { SupabaseInterceptorService } from "../supabase-interceptor/supabase-interceptor.service";
import {
  BehaviorSubject,
  catchError,
  from,
  Observable,
  of,
  switchMap,
  throwError,
} from "rxjs";
import { DOCUMENT } from "@angular/common";

@Injectable({
  providedIn: "root",
})
export class SupabaseService {
  public sb: SupabaseClient<Database>;
  private _session: AuthSession | null = null;
  private isSupabaseReadyBehaviorSubject = new BehaviorSubject<boolean>(false);
  isSupabaseReady = this.isSupabaseReadyBehaviorSubject.asObservable();
  constructor(private supabaseInterceptor: SupabaseInterceptorService) {
    this.sb = createClient<Database>(
      environment.supabaseUrl,
      environment.supabaseKey,
      {
        global: {
          fetch: (input: any, init?: RequestInit) =>
            this.supabaseInterceptor.fetchWrapper(input, init),
        },
      },
    );

    // Update _session automatically on auth state changes.
    this.sb.auth.onAuthStateChange((event, session) => {
      this.isSupabaseReadyBehaviorSubject.next(true);
      this._session = session;
    });
  }

  /**
   * Retrieves the current session.
   * This method fetches the latest session and updates the local _session variable.
   */
  async getSession(): Promise<AuthSession | null> {
    const { data, error } = await this.sb.auth.getSession();
    if (error) {
      return null;
    }
    this._session = data.session;
    return this._session;
  }

  /**
   * Subscribe to auth state changes.
   * Returns the listener that can be used to unsubscribe.
   */
  authChanges(
    callback: (event: AuthChangeEvent, session: Session | null) => void,
  ) {
    return this.sb.auth.onAuthStateChange(callback);
  }

  signIn(email: string, password: string): Observable<any> {
    return from(
      this.sb.auth.signInWithPassword({ email, password }),
    ).pipe(
      switchMap(({ data, error }) => {
        if (error || !data.user) {
          return throwError(() => new Error("Invalid email or password"));
        }

        const userId = data.user.id;

        // Fetch the staff record to check if user is active
        return from(
          this.sb
            .from("Staff")
            .select()
            .eq("id", userId)
            .single(),
        ).pipe(
          switchMap(({ data: staff, error: staffError }) => {
            if (staffError || !staff) {
              return from(this.sb.auth.signOut()).pipe(
                switchMap(() =>
                  throwError(() =>
                    new Error("Unauthorized: Not a staff member")
                  )
                ),
              );
            }

            if (!staff.isActive) {
              return from(this.sb.auth.signOut()).pipe(
                switchMap(() =>
                  throwError(() =>
                    new Error("Your account is inactive. Contact admin.")
                  )
                ),
              );
            }

            // Return session if user is valid
            return of(staff as any);
          }),
        );
      }),
      catchError((error) => {
        return throwError(() => error);
      }),
    );
  }

  async signOut(): Promise<void> {
    const { error } = await this.sb.auth.signOut();
    if (error) {
      throw error;
    }
    this._session = null;
  }
}
