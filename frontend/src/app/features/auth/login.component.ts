import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { finalize } from 'rxjs';
import { AuthService } from '../../core/services/auth.service';
import { ToastService } from '../../core/services/toast.service';
import { UiButtonComponent } from '../../shared/ui/ui-button/ui-button.component';
import { UiCardComponent } from '../../shared/ui/ui-card/ui-card.component';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink, UiCardComponent, UiButtonComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="container py-5">
    <div class="row justify-content-center">
      <div class="col-12 col-md-8 col-lg-5">
        <app-ui-card title="Sign in" headingId="login-title" subtitle="Library staff and patrons.">
          <form [formGroup]="form" (ngSubmit)="submit()" novalidate>
            <div class="mb-3">
              <label class="form-label" for="login-email">Email</label>
              <input
                id="login-email"
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
              <label class="form-label" for="login-password">Password</label>
              <input
                id="login-password"
                class="form-control"
                type="password"
                autocomplete="current-password"
                formControlName="password"
                required
                aria-required="true"
                [attr.aria-invalid]="form.controls.password.invalid && form.controls.password.touched ? 'true' : 'false'"
              />
            </div>
            <div class="d-flex gap-2 justify-content-between align-items-center">
              <a routerLink="/auth/register">Create an account</a>
              <app-ui-button type="submit" [busy]="busy()" [disabled]="form.invalid">Sign in</app-ui-button>
            </div>
          </form>
        </app-ui-card>
      </div>
    </div>
    </div>
  `,
})
export class LoginComponent {
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
      .login(email, password)
      .pipe(finalize(() => this.busy.set(false)))
      .subscribe({
        next: () => void this.router.navigateByUrl('/dashboard'),
        error: () => this.toast.show('Unable to sign in.'),
      });
  }
}
