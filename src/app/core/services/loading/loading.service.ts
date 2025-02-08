import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LoadingService {
  private loadingSubject = new BehaviorSubject<boolean>(false);
  public loading$: Observable<boolean> = this.loadingSubject.asObservable();

  private requestsCount = 0;

  show(): void {
    // A new request has started
    this.requestsCount++;

    // If this is the first request, display the loader
    if (this.requestsCount === 1) {
      this.loadingSubject.next(true);
    }
  }

  hide(): void {
    // A request has ended
    if (this.requestsCount > 0) {
      this.requestsCount--;
    }

    // If no more requests are running, hide the loader
    if (this.requestsCount === 0) {
      this.loadingSubject.next(false);
    }
  }
}
