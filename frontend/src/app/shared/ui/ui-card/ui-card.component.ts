import { ChangeDetectionStrategy, Component, input } from '@angular/core';

@Component({
  selector: 'app-ui-card',
  standalone: true,
  template: `
    <section class="card shadow-sm border-0" [attr.aria-labelledby]="headingId()">
      <div class="card-body">
        <h2 class="h5 card-title" [id]="headingId()">{{ title() }}</h2>
        @if (subtitle()) {
          <p class="text-muted small mb-3">{{ subtitle() }}</p>
        }
        <ng-content />
      </div>
    </section>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UiCardComponent {
  readonly title = input.required<string>();
  readonly subtitle = input<string | undefined>(undefined);
  readonly headingId = input.required<string>();
}
