import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router, provideRouter } from '@angular/router';
import { of, throwError } from 'rxjs';
import { LoginComponent } from './login.component';
import { AuthService } from '../../core/services/auth.service';
import { ToastService } from '../../core/services/toast.service';

describe('LoginComponent', () => {
  let fixture: ComponentFixture<LoginComponent>;
  let auth: jest.Mocked<Pick<AuthService, 'login'>>;

  beforeEach(async () => {
    auth = {
      login: jest.fn().mockReturnValue(
        of({
          token: 't',
          user: { id: '1', email: 'a@b.com', role: 'PUBLIC', createdAt: '' },
        }),
      ),
    };
    await TestBed.configureTestingModule({
      imports: [LoginComponent],
      providers: [
        provideRouter([]),
        { provide: AuthService, useValue: auth },
        { provide: ToastService, useValue: { show: jest.fn() } },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(LoginComponent);
    fixture.detectChanges();
  });

  it('submits valid form', () => {
    const router = TestBed.inject(Router);
    jest.spyOn(router, 'navigateByUrl').mockResolvedValue(true);
    const cmp = fixture.componentInstance;
    cmp.form.setValue({ email: 'a@b.com', password: 'password123' });
    cmp.submit();
    expect(auth.login).toHaveBeenCalledWith('a@b.com', 'password123');
    expect(router.navigateByUrl).toHaveBeenCalledWith('/dashboard');
  });

  it('shows toast on login failure', () => {
    const toast = TestBed.inject(ToastService) as jest.Mocked<Pick<ToastService, 'show'>>;
    auth.login.mockReturnValueOnce(throwError(() => new Error('x')));
    const cmp = fixture.componentInstance;
    cmp.form.setValue({ email: 'a@b.com', password: 'password123' });
    cmp.submit();
    expect(toast.show).toHaveBeenCalled();
  });
});
