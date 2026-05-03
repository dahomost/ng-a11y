import { TestBed } from '@angular/core/testing';
import { type ActivatedRouteSnapshot, Router, type RouterStateSnapshot } from '@angular/router';
import { authGuard } from './auth.guard';
import { AuthService } from '../services/auth.service';

describe('authGuard', () => {
  const route = {} as ActivatedRouteSnapshot;
  const state = {} as RouterStateSnapshot;

  it('allows navigation when authenticated', () => {
    TestBed.configureTestingModule({
      providers: [
        { provide: AuthService, useValue: { isAuthenticated: () => true } },
        { provide: Router, useValue: { createUrlTree: jest.fn() } },
      ],
    });
    expect(TestBed.runInInjectionContext(() => authGuard(route, state))).toBe(true);
  });

  it('redirects to login when unauthenticated', () => {
    const createUrlTree = jest.fn().mockReturnValue('TREE');
    TestBed.configureTestingModule({
      providers: [
        { provide: AuthService, useValue: { isAuthenticated: () => false } },
        { provide: Router, useValue: { createUrlTree } },
      ],
    });
    const out = TestBed.runInInjectionContext(() => authGuard(route, state));
    expect(createUrlTree).toHaveBeenCalledWith(['/auth', 'login']);
    expect(out).toBe('TREE');
  });
});
