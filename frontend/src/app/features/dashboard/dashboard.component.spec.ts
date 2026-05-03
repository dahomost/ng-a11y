import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { of } from 'rxjs';
import { DashboardComponent } from './dashboard.component';
import { AuthService } from '../../core/services/auth.service';
import { CollectionsService } from '../collections/collections.service';
import { TagsService } from '../tags/tags.service';

describe('DashboardComponent', () => {
  let fixture: ComponentFixture<DashboardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DashboardComponent],
      providers: [
        provideRouter([]),
        {
          provide: CollectionsService,
          useValue: { list: () => of({ collections: [{}, {}] as never }) },
        },
        { provide: TagsService, useValue: { list: () => of({ tags: [{}] as never }) } },
        { provide: AuthService, useValue: { user: () => null } },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(DashboardComponent);
    fixture.detectChanges();
  });

  it('loads counts', () => {
    const cmp = fixture.componentInstance;
    expect(cmp.collectionCount()).toBe(2);
    expect(cmp.tagCount()).toBe(1);
  });
});
