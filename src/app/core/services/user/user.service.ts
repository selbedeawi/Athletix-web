import { inject, Injectable } from '@angular/core';
import { BehaviorSubject, filter, Observable, take } from 'rxjs';

import { Router } from '@angular/router';
import { SupabaseService } from '../supabase/supabase.service';
import { StaffAccount } from '../../../features/staff-list/models/staff';
import { APP_ROUTES } from '../../enums/pages-urls-enum';
import { SnackbarService } from '../snackbar/snackbar.service';
import { Session } from '@supabase/auth-js';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private supabaseService = inject(SupabaseService);
  private snackbarService = inject(SnackbarService);

  private userSubject = new BehaviorSubject<StaffAccount | null>(null);

  public currentUser$ = this.userSubject.asObservable();

  private initializedSubject = new BehaviorSubject<boolean>(false);
  public initialized$ = this.initializedSubject.asObservable();

  private router = inject(Router);

  constructor() {
    this.supabaseService.isSupabaseReady
      .pipe(
        filter((res) => !!res),
        take(1)
      )
      .subscribe((res) => {
        if (res) {
          this.supabaseService.authChanges(async (_event, session) => {
            setTimeout(async () => {
              this.setSession(session);
            }, 0);
          });
        }
      });
  }

  /**
   * Checks for an existing session and, if present,
   * fetches the account data from the "accounts" table.
   */
  // async initializeUser(): Promise<void> {
  //   const session = await this.supabaseService.getSession();
  //   await this.setSession(session);
  // }
  async setSession(session: Session | null) {
    if (session?.user && session?.user.app_metadata?.['role'] === 'Member') {
      const { data: account, error } = await this.supabaseService.sb
        .from('Members')
        .select()
        .eq('id', session.user.id)
        .single();
      if (error) {
        this.snackbarService.error('ERROR_MEMBER_FETCHING_ACCOUNT_DATA');
        this.userSubject.next(null);
      } else {
        this.userSubject.next(account as any);
      }
      this.initializedSubject.next(true);
    } else if (session?.user?.id) {
      const { data: account, error } = await this.supabaseService.sb
        .from('Staff')
        .select()
        .eq('id', session.user.id)
        .single();

      if (error) {
        this.snackbarService.error('ERROR_FETCHING_ACCOUNT_DATA');
        this.userSubject.next(null);
      } else if (!account.isActive) {
        this.snackbarService.error('YOUR_ACCOUNT_IS_INACTIVE');
        await this.logout();
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
  async logout(
    navigateTo: string[] | null = ['/', APP_ROUTES.AUTH, APP_ROUTES.LOGIN]
  ): Promise<void> {
    await this.supabaseService.signOut();
    this.userSubject.next(null);
    if (navigateTo) {
      this.router.navigate(navigateTo);
    }
  }
}
