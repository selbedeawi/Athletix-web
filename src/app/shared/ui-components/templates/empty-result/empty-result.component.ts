import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { MatIcon } from '@angular/material/icon';

@Component({
  selector: 'app-empty-result',
  imports: [MatIcon],
  templateUrl: './empty-result.component.html',
  styleUrls: ['./empty-result.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EmptyResultComponent {
  title = input.required<string>();
  image = input.required<string>();
}
