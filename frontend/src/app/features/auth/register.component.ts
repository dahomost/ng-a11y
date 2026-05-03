import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { finalize } from 'rxjs';
import { AuthService } from '../../core/services/auth.service';
import { ToastService } from '../../core/services/toast.service';
import { UiButtonComponent } from '../../shared/ui/ui-button/ui-button.component';
import { UiCardComponent } from '../../shared/ui/ui-card/ui-card.component';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink, UiCardComponent, UiButtonComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="container py-5">
    <div class="row justify-content-center">
      <div class="col-12 col-md-8 col-lg-5">
        <app-ui-card title="Create account" headingId="register-title" subtitle="Public access by default.">
          <form [formGroup]="form" (ngSubmit)="submit()" novalidate>
            <div class="mb-3">
              <label class="form-label" for="register-email">Email</label>
              <input
                id="register-email"
                class="form-control"
                type="email"
                autocomplete="email"
                formControlName="email"
                required
                aria-required="true"
                [attr.aria-invalid]="form.controls.email.invalid && form.controls.email.touched ? 'true' : 'false'"
              />
            </div>
            <div class="mb-3">
              <label class="form-label" for="register-password">Password</label>
              <input
                id="register-password"
                class="form-control"
                type="password"
                autocomplete="new-password"
                formControlName="password"
                required
                aria-required="true"
                aria-describedby="register-password-hint"
                [attr.aria-invalid]="form.controls.password.invalid && form.controls.password.touched ? 'true' : 'false'"
              />
              <div id="register-password-hint" class="form-text">Minimum 8 characters.</div>
            </div>
            <div class="d-flex gap-2 justify-content-between align-items-center">
              <a routerLink="/auth/login">Already have an account?</a>
              <app-ui-button type="submit" [busy]="busy()" [disabled]="form.invalid">Register</app-ui-button>
            </div>
          </form>
        </app-ui-card>
      </div>
    </div>
    </div>
  `,
})
export class RegisterComponent {
  private readonly auth = inject(AuthService);
  private readonly router = inject(Router);
  private readonly toast = inject(ToastService);
  private readonly fb = inject(FormBuilder);

  protected readonly busy = signal(false);

  readonly form = this.fb.nonNullable.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(8)]],
  });

  submit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    const { email, password } = this.form.getRawValue();
    this.busy.set(true);
    this.auth
      .register(email, password)
      .pipe(finalize(() => this.busy.set(false)))
      .subscribe({
        next: () => void this.router.navigateByUrl('/dashboard'),
        error: () => this.toast.show('Unable to register.'),
      });
  }
}
