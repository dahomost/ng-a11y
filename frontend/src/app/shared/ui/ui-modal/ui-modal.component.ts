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
  template: `
    @if (open()) {
      <div class="modal fade show d-block" tabindex="-1" role="presentation" aria-hidden="false">
        <div class="modal-dialog modal-dialog-centered modal-lg" role="document">
          <div
            class="modal-content"
            cdkTrapFocus
            cdkTrapFocusAutoCapture
            role="dialog"
            aria-modal="true"
            [attr.aria-labelledby]="titleId()"
          >
            <div class="modal-header">
              <h1 class="modal-title h5" [id]="titleId()">{{ title() }}</h1>
              <app-ui-button variant="outline" [ariaLabel]="'Close dialog'" (clicked)="close.emit()">
                Close
              </app-ui-button>
            </div>
            <div class="modal-body" #body>
              <ng-content />
            </div>
          </div>
        </div>
      </div>
      <div class="modal-backdrop fade show" (click)="backdropClose.emit()" role="presentation"></div>
    }
  `,
  styles: [
    `
      .modal {
        pointer-events: none;
      }
      .modal-dialog,
      .modal-backdrop {
        pointer-events: auto;
      }
    `,
  ],
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
