import { ComponentFixture, TestBed } from '@angular/core/testing';
import { UiCardComponent } from './ui-card.component';

describe('UiCardComponent', () => {
  let fixture: ComponentFixture<UiCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UiCardComponent],
    }).compileComponents();
    fixture = TestBed.createComponent(UiCardComponent);
    fixture.componentRef.setInput('title', 'T');
    fixture.componentRef.setInput('headingId', 'hid');
    fixture.detectChanges();
  });

  it('renders title and labelled section', () => {
    const root: HTMLElement = fixture.nativeElement;
    expect(root.querySelector('h2')?.textContent).toContain('T');
    expect(root.querySelector('section')?.getAttribute('aria-labelledby')).toBe('hid');
  });

  it('renders subtitle if provided', () => {
    fixture.componentRef.setInput('subtitle', 'S');
    fixture.detectChanges();
    const root: HTMLElement = fixture.nativeElement;
    expect(root.querySelector('p')?.textContent).toContain('S');
  });
});
