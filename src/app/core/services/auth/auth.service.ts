import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { UserService } from '../user/user.service';
import { BEResponse } from '../../../shared/models/shared-models';
import { ILoginRes } from '../../../shared/models/auth.model';

export interface LoginCredentials {
  email: string;
  password: string;
}

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private AUTH_TOKEN_KEY = 'token';
  private _isLoggedIn$ = new BehaviorSubject<boolean>(false);

  isLoggedIn$ = this._isLoggedIn$.asObservable();
  constructor(private http: HttpClient, private userService: UserService) {
    const token = localStorage.getItem(this.AUTH_TOKEN_KEY);
    this._isLoggedIn$.next(!!token);
  }

  login(credentials: LoginCredentials): Observable<BEResponse<ILoginRes>> {
    return this.http
      .post<BEResponse<ILoginRes>>('api/auth/login', credentials)
      .pipe(
        tap((response: BEResponse<ILoginRes>) => {
          console.log('res');

          this.setToken(response.data.token);
          this._isLoggedIn$.next(true);
          // this.userService.setUserId(response?.data?.user?.accountId);
          // this.userService.fetchUserData();
        })
      );
  }

  logout(): void {
    localStorage.removeItem(this.AUTH_TOKEN_KEY);
    this._isLoggedIn$.next(false);
    // this.userService.clearUser();
  }

  setToken(token: string): void {
    console.log('TOKEN', token);

    localStorage.setItem(this.AUTH_TOKEN_KEY, token);
  }

  getToken(): string | null {
    return localStorage.getItem(this.AUTH_TOKEN_KEY);
  }

  forgetPassword(email: string): Observable<BEResponse<any>> {
    return this.http.post<BEResponse<any>>('api/auth/reset-password-init', {
      email: email,
    });
  }

  confirmChangePassword(
    token: string,
    password: string,
    email: string
  ): Observable<BEResponse<any>> {
    return this.http.post<BEResponse<any>>('api/auth/reset-password-complete', {
      code: token,
      password: password,
      email: email,
    });
  }

  verifyEmail(token: string, userId: string) {
    return this.http.post<BEResponse<any>>('api/auth/verify-email', {
      userId: userId,
      token: token,
    });
  }
  sendVerifyEmail(email: string) {
    return this.http.post<BEResponse<any>>('api/auth/send-verify-email', {
      email,
    });
  }
}
