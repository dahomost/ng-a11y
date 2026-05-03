import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { of, throwError } from 'rxjs';
import { RegisterComponent } from './register.component';
import { AuthService } from '../../core/services/auth.service';
import { ToastService } from '../../core/services/toast.service';

describe('RegisterComponent', () => {
  let fixture: ComponentFixture<RegisterComponent>;
  let auth: jest.Mocked<Pick<AuthService, 'register'>>;

  beforeEach(async () => {
    auth = {
      register: jest.fn().mockReturnValue(
        of({
          token: 't',
          user: { id: '1', email: 'n@e.com', role: 'PUBLIC', createdAt: '' },
        }),
      ),
    };
    await TestBed.configureTestingModule({
      imports: [RegisterComponent],
      providers: [
        provideRouter([]),
        { provide: AuthService, useValue: auth },
        { provide: ToastService, useValue: { show: jest.fn() } },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(RegisterComponent);
    fixture.detectChanges();
  });

  it('calls register service', () => {
    const cmp = fixture.componentInstance;
    cmp.form.setValue({ email: 'n@e.com', password: 'password123' });
    cmp.submit();
    expect(auth.register).toHaveBeenCalledWith('n@e.com', 'password123');
  });

  it('shows toast on failure', () => {
    const toast = TestBed.inject(ToastService) as jest.Mocked<Pick<ToastService, 'show'>>;
    auth.register.mockReturnValueOnce(throwError(() => new Error('x')));
    const cmp = fixture.componentInstance;
    cmp.form.setValue({ email: 'n@e.com', password: 'password123' });
    cmp.submit();
    expect(toast.show).toHaveBeenCalled();
  });
});
