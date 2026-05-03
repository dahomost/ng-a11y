import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { AppShellComponent } from './app-shell.component';
import { AuthService } from '../core/services/auth.service';
import { LoadingService } from '../core/services/loading.service';
import { ToastService } from '../core/services/toast.service';

describe('AppShellComponent', () => {
  let fixture: ComponentFixture<AppShellComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AppShellComponent],
      providers: [
        provideRouter([]),
        {
          provide: AuthService,
          useValue: {
            user: () => ({ id: '1', email: 'a@b.com', role: 'PUBLIC', createdAt: '' }),
            logout: jest.fn(),
          },
        },
        { provide: LoadingService, useValue: { isLoading: () => false } },
        { provide: ToastService, useValue: { message: () => null, clear: jest.fn() } },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(AppShellComponent);
    fixture.detectChanges();
  });

  it('creates', () => {
    expect(fixture.componentInstance).toBeTruthy();
  });

  it('renders skip link', () => {
    const el: HTMLElement = fixture.nativeElement;
    const skip = el.querySelector('a[href="#main-content"]');
    expect(skip?.textContent).toContain('Skip');
  });
});
