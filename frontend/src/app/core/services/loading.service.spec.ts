import { TestBed } from '@angular/core/testing';
import { LoadingService } from './loading.service';

describe('LoadingService', () => {
  it('tracks concurrent operations', () => {
    TestBed.configureTestingModule({});
    const svc = TestBed.inject(LoadingService);
    expect(svc.isLoading()).toBe(false);
    svc.begin();
    expect(svc.isLoading()).toBe(true);
    svc.begin();
    svc.end();
    expect(svc.isLoading()).toBe(true);
    svc.end();
    expect(svc.isLoading()).toBe(false);
  });
});
