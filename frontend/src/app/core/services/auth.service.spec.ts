import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { environment } from '../../../environments/environment';
import { AuthService } from './auth.service';

describe('AuthService', () => {
  let service: AuthService;
  let http: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [AuthService, provideHttpClient(), provideHttpClientTesting()],
    });
    service = TestBed.inject(AuthService);
    http = TestBed.inject(HttpTestingController);
    sessionStorage.clear();
  });

  afterEach(() => {
    http.verify();
    sessionStorage.clear();
  });

  it('posts login and persists session', () => {
    let token: string | null = null;
    service.login('a@b.com', 'secret1234').subscribe((res) => {
      token = res.token;
    });

    const req = http.expectOne(`${environment.apiBaseUrl}/auth/login`);
    expect(req.request.method).toBe('POST');
    req.flush({ token: 't1', user: { id: '1', email: 'a@b.com', role: 'PUBLIC', createdAt: new Date().toISOString() } });

    expect(token).toBe('t1');
    expect(service.isAuthenticated()).toBe(true);
  });
});
