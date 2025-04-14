import { Injectable } from "@angular/core";
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
import { BehaviorSubject, from, Observable } from "rxjs";

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
  forgetPassword(email: string) {
    const redirectTo = window.location.origin + "/auth/reset";
    return from(this.sb.auth.resetPasswordForEmail(email, { redirectTo }));
  }
  confirmChangePassword(
    newPassword: string,
  ): Observable<any> {
    return from(this.sb.auth.updateUser({ password: newPassword }));
  }

  signIn(email: string, password: string) {
    return from(
      this.sb.auth.signInWithPassword({ email, password }),
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
