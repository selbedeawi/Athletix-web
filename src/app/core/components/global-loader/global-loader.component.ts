import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { LoadingService } from '../../services/loading/loading.service';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { AsyncPipe } from '@angular/common';

@Component({
  selector: 'app-global-loader',
  imports: [MatProgressSpinnerModule,AsyncPipe],
  template: `
    @if (isLoading$ | async) {
    <div class="overlay">
      <mat-spinner></mat-spinner>
    </div>
    }
  `,
  styles: [
    `
      .overlay {
        position: fixed;
        top: 0;
        left: 0;
        width: 100vw;
        height: 100vh;
        display: flex;
        align-items: center;
        justify-content: center;
        background-color: rgba(0, 0, 0, 0.3);
        z-index: 9999;
      }
    `,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GlobalLoaderComponent {
  loadingService = inject(LoadingService);
  isLoading$: Observable<boolean> = this.loadingService.loading$;
}
