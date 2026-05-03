import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';

@Component({
  selector: 'app-ui-button',
  standalone: true,
  template: `
    <button
      [type]="type()"
      [attr.aria-busy]="busy() ? 'true' : null"
      [disabled]="disabled() || busy()"
      [attr.aria-label]="ariaLabel() || null"
      class="btn"
      [class.btn-primary]="variant() === 'primary'"
      [class.btn-secondary]="variant() === 'secondary'"
      [class.btn-outline-secondary]="variant() === 'outline'"
      [class.btn-danger]="variant() === 'danger'"
      (click)="clicked.emit($event)"
    >
      <ng-content />
    </button>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UiButtonComponent {
  readonly type = input<'button' | 'submit'>('button');
  readonly variant = input<'primary' | 'secondary' | 'outline' | 'danger'>('primary');
  readonly disabled = input(false);
  readonly busy = input(false);
  readonly ariaLabel = input<string | undefined>(undefined);
  readonly clicked = output<MouseEvent>();
}
