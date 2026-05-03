import { ChangeDetectionStrategy, Component, input } from '@angular/core';

@Component({
  selector: 'app-ui-table',
  standalone: true,
  templateUrl: './ui-table.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UiTableComponent {
  readonly caption = input.required<string>();
  readonly columns = input.required<{ key: string; label: string }[]>();
}
