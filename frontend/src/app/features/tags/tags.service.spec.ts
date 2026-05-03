import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { environment } from '../../../environments/environment';
import { TagsService } from './tags.service';

describe('TagsService', () => {
  let svc: TagsService;
  let http: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [TagsService, provideHttpClient(), provideHttpClientTesting()],
    });
    svc = TestBed.inject(TagsService);
    http = TestBed.inject(HttpTestingController);
  });

  afterEach(() => http.verify());

  it('lists tags', () => {
    svc.list().subscribe();
    const req = http.expectOne(`${environment.apiBaseUrl}/tags`);
    expect(req.request.method).toBe('GET');
    req.flush({ tags: [] });
  });
});
