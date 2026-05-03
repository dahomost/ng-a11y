import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { of } from 'rxjs';
import { CollectionsPage } from './collections.page';
import { CollectionsService } from './collections.service';
import { AuthService } from '../../core/services/auth.service';
import { ToastService } from '../../core/services/toast.service';

describe('CollectionsPage', () => {
  let fixture: ComponentFixture<CollectionsPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CollectionsPage],
      providers: [
        provideRouter([]),
        {
          provide: CollectionsService,
          useValue: {
            list: () => of({ collections: [] }),
            create: () => of({ collection: {} as never }),
            update: () => of({ collection: {} as never }),
            remove: () => of(void 0),
          },
        },
        { provide: AuthService, useValue: { canManageCatalog: () => false } },
        { provide: ToastService, useValue: { show: jest.fn() } },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(CollectionsPage);
    fixture.detectChanges();
  });

  it('creates', () => {
    expect(fixture.componentInstance).toBeTruthy();
  });
});
