import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { AuthService } from '../core/services/auth.service';
import { LoadingService } from '../core/services/loading.service';
import { ToastService } from '../core/services/toast.service';
import { UiButtonComponent } from '../shared/ui/ui-button/ui-button.component';

@Component({
  selector: 'app-shell',
  standalone: true,
  imports: [CommonModule, RouterOutlet, RouterLink, RouterLinkActive, UiButtonComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <a class="visually-hidden-focusable position-absolute top-0 start-0 m-2 btn btn-sm btn-primary" href="#main-content">
      Skip to main content
    </a>

    <div
      class="position-fixed top-0 end-0 p-2"
      role="status"
      aria-live="polite"
      aria-atomic="true"
      [class.visually-hidden]="!loading.isLoading()"
    >
      Loading…
    </div>

    @if (toast.message(); as msg) {
      <div class="alert alert-danger m-3" role="alert">
        <div class="d-flex justify-content-between gap-2 align-items-start">
          <span [attr.aria-label]="'Error: ' + msg">{{ msg }}</span>
          <button type="button" class="btn btn-sm btn-outline-dark" (click)="toast.clear()">Dismiss</button>
        </div>
      </div>
    }

    <header class="border-bottom bg-body-tertiary">
      <div class="container py-3 d-flex flex-wrap align-items-center justify-content-between gap-2">
        <div class="d-flex align-items-center gap-2">
          <span class="fw-semibold">Library Console</span>
          @if (auth.user(); as u) {
            <span class="text-muted small">Signed in as {{ u.email }} ({{ u.role }})</span>
          }
        </div>
        <nav aria-label="Primary">
          <ul class="nav">
            <li class="nav-item">
              <a
                class="nav-link"
                routerLink="/dashboard"
                routerLinkActive="active"
                [routerLinkActiveOptions]="{ exact: true }"
                >Dashboard</a
              >
            </li>
            <li class="nav-item">
              <a class="nav-link" routerLink="/collections" routerLinkActive="active">Collections</a>
            </li>
          </ul>
        </nav>
        <app-ui-button variant="outline" (clicked)="logout()">Sign out</app-ui-button>
      </div>
    </header>

    <main id="main-content" class="container py-4" tabindex="-1">
      <router-outlet />
    </main>
  `,
})
export class AppShellComponent {
  protected readonly auth = inject(AuthService);
  protected readonly loading = inject(LoadingService);
  protected readonly toast = inject(ToastService);
  private readonly router = inject(Router);

  logout(): void {
    this.auth.logout();
    void this.router.navigateByUrl('/auth/login');
  }
}
