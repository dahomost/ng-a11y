import { TestBed } from '@angular/core/testing';
import { ToastService } from './toast.service';

describe('ToastService', () => {
  it('stores and clears messages', () => {
    TestBed.configureTestingModule({});
    const svc = TestBed.inject(ToastService);
    expect(svc.message()).toBeNull();
    svc.show('Bad');
    expect(svc.message()).toBe('Bad');
    svc.clear();
    expect(svc.message()).toBeNull();
  });
});
