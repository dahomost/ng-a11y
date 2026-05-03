import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { environment } from '../../../environments/environment';
import { CollectionsService } from './collections.service';

describe('CollectionsService', () => {
  let svc: CollectionsService;
  let http: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [CollectionsService, provideHttpClient(), provideHttpClientTesting()],
    });
    svc = TestBed.inject(CollectionsService);
    http = TestBed.inject(HttpTestingController);
  });

  afterEach(() => http.verify());

  it('lists collections', () => {
    let out: unknown;
    svc.list().subscribe((r) => (out = r));
    const req = http.expectOne(`${environment.apiBaseUrl}/collections`);
    expect(req.request.method).toBe('GET');
    req.flush({ collections: [] });
    expect(out).toEqual({ collections: [] });
  });
});
