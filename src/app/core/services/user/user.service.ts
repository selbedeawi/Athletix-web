import { inject, Injectable } from '@angular/core';
import { BehaviorSubject, Observable, take } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { BasicAccount } from '../../../shared/models/basic-account-model';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private USER_ID_KEY = 'userId';
  private userSubject: BehaviorSubject<BasicAccount | null> =
    new BehaviorSubject<BasicAccount | null>(null);
  private readonly apiUrl = `api/accounts/`;
  private http = inject(HttpClient);
  // /**
  //  * Returns an observable for the current user,
  //  * useful when a component wants to subscribe for changes.
  //  */
  get currentUser$(): Observable<BasicAccount | null> {
    return this.userSubject.asObservable();
  }
  // /**
  //  * Returns the latest snapshot of the current user,
  //  * useful when you need synchronous access.
  //  */
  get currentUser(): BasicAccount | null {
    return this.userSubject.value;
  }
  // /**
  //  * Fetches user data from the API and updates the BehaviorSubject.
  //  */
  fetchUserData(): void {
    // this.http.get<any>(this.apiUrl + this.getUserId()).pipe(take(1)).subscribe({
    //   next: (user) => {
    //     console.log("USER",user);
    //     this.userSubject.next(user.data);
    //   },
    //   error: () => this.userSubject.next(null),
    // });
  }
  // /**
  //  * Clears the user from memory and notifies subscribers.
  //  */
  clearUser(): void {
    this.userSubject.next(null);
    // localStorage.removeItem(this.USER_ID_KEY)
  }
  // /**
  //  * The function `setUserId` stores a user ID in the local storage as a string.
  //  * @param {number} userId - The `userId` parameter is a number that represents the user's
  //  * identification.
  //  */
  setUserId(userId: number) {
    localStorage.setItem(this.USER_ID_KEY, userId.toString());
  }
  // /**
  //  * The getUserId function retrieves the user ID from local storage.
  //  * @returns The `getUserId` function is returning the value stored in the `localStorage` with the key
  //  * `this.USER_ID_KEY`.
  //  */
  getUserId() {
    return localStorage.getItem(this.USER_ID_KEY);
  }
}
