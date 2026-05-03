import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-ui-input',
  standalone: true,
  imports: [FormsModule],
  template: `
    <label class="form-label" [attr.for]="controlId()">{{ label() }}</label>
    <input
      class="form-control"
      [id]="controlId()"
      [name]="controlId()"
      [type]="type()"
      [attr.autocomplete]="autocomplete()"
      [attr.aria-invalid]="invalid() ? 'true' : 'false'"
      [attr.aria-describedby]="describedBy()"
      [attr.required]="required() ? true : null"
      [disabled]="disabled()"
      [ngModel]="value()"
      (ngModelChange)="valueChange.emit($event)"
    />
    @if (hint()) {
      <div class="form-text" [id]="hintId()">{{ hint() }}</div>
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UiInputComponent {
  readonly controlId = input.required<string>();
  readonly label = input.required<string>();
  readonly type = input<'text' | 'email' | 'password' | 'search' | 'date'>('text');
  readonly value = input<string>('');
  readonly hint = input<string | undefined>(undefined);
  readonly invalid = input(false);
  readonly required = input(false);
  readonly disabled = input(false);
  readonly autocomplete = input<string | undefined>(undefined);
  readonly valueChange = output<string>();

  protected hintId(): string {
    return `${this.controlId()}-hint`;
  }

  protected describedBy(): string | null {
    return this.hint() ? this.hintId() : null;
  }
}
