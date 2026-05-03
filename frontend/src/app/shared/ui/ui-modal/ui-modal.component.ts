import { A11yModule } from '@angular/cdk/a11y';
import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  effect,
  input,
  output,
  viewChild,
} from '@angular/core';
import { UiButtonComponent } from '../ui-button/ui-button.component';

@Component({
  selector: 'app-ui-modal',
  standalone: true,
  imports: [A11yModule, UiButtonComponent],
  templateUrl: './ui-modal.component.html',
  styleUrl: './ui-modal.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UiModalComponent {
  readonly open = input(false);
  readonly title = input.required<string>();
  readonly titleId = input.required<string>();
  readonly close = output<void>();
  readonly backdropClose = output<void>();

  private readonly body = viewChild<ElementRef<HTMLElement>>('body');

  constructor() {
    effect(() => {
      if (this.open()) {
        queueMicrotask(() =>
          this.body()?.nativeElement.querySelector<HTMLElement>('input,button,select,textarea')?.focus(),
        );
      }
    });
  }
}
