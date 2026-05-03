import { ChangeDetectionStrategy, Component, input } from '@angular/core';

@Component({
  selector: 'app-ui-table',
  standalone: true,
  template: `
    <div class="table-responsive">
      <table class="table table-striped align-middle">
        <caption class="visually-hidden">
          {{ caption() }}
        </caption>
        <thead>
          <tr>
            @for (c of columns(); track c.key) {
              <th scope="col">{{ c.label }}</th>
            }
          </tr>
        </thead>
        <tbody>
          <ng-content />
        </tbody>
      </table>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UiTableComponent {
  readonly caption = input.required<string>();
  readonly columns = input.required<{ key: string; label: string }[]>();
}
