import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';

@Component({
  selector: 'app-ui-button',
  standalone: true,
  templateUrl: './ui-button.component.html',
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
