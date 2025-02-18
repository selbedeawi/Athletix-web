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
import { BehaviorSubject, from, switchMap } from "rxjs";

@Injectable({
  providedIn: "root",
})
export class SupabaseService {
  public supabase: SupabaseClient<Database>;
  private _session: AuthSession | null = null;
  private isSupabaseReadyBehaviorSubject = new BehaviorSubject<boolean>(false);
  isSupabaseReady = this.isSupabaseReadyBehaviorSubject.asObservable();
  constructor(private supabaseInterceptor: SupabaseInterceptorService) {
    this.supabase = createClient<Database>(
      environment.supabaseUrl,
      environment.supabaseKey,
      {
        global: {
          // Ensure the input type includes URL (and RequestInfo)
          fetch: (input: any, init?: RequestInit) =>
            this.supabaseInterceptor.fetchWrapper(input, init),
        },
      },
    );

    // Update _session automatically on auth state changes.
    this.supabase.auth.onAuthStateChange((event, session) => {
      this.isSupabaseReadyBehaviorSubject.next(true);
      this._session = session;
    });
  }

  /**
   * Retrieves the current session.
   * This method fetches the latest session and updates the local _session variable.
   */
  async getSession(): Promise<AuthSession | null> {
    const { data, error } = await this.supabase.auth.getSession();
    if (error) {
      console.error("Error fetching session:", error.message);
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
    return this.supabase.auth.onAuthStateChange(callback);
  }

  signIn(email: string, password: string) {
    return from(this.supabase.auth.signInWithPassword({
      email: "mohammedzelrais0@gmail.com",
      password: "As123456",
    })).pipe(switchMap((res) => {
      console.log(res.data.user);

      return from(
        this.supabase.from("Staff").select().eq(
          "id",
          (res.data.user as any).id,
        ),
      );
    }));
  }

  async signOut(): Promise<void> {
    const { error } = await this.supabase.auth.signOut();
    if (error) {
      throw error;
    }
    this._session = null;
  }
}
// const mo = {
//   nationalId: "234234324",
//   phoneNumber: "2342342342",
//   email: "mohammedzelrais0+2@gmail.com",
//   password: "As123456",
//   firstName: "mo1",
//   lastName: "mo2",
//   isActive: true,

//   role: AccountType.Coach,

//   dateOfBirth: "12/12/1990", // Stored as ISO date string (YYYY-MM-DD)

//   isFirstTime: false,
// };
// return this.supabase.functions.invoke("create-account", {
//   body: mo,
// });
