import { ComponentFixture, TestBed } from '@angular/core/testing';
import { UiButtonComponent } from './ui-button.component';

describe('UiButtonComponent', () => {
  let fixture: ComponentFixture<UiButtonComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UiButtonComponent],
    }).compileComponents();
    fixture = TestBed.createComponent(UiButtonComponent);
    fixture.componentRef.setInput('variant', 'primary');
    fixture.detectChanges();
  });

  it('emits click', () => {
    const cmp = fixture.componentInstance;
    const spy = jest.fn();
    cmp.clicked.subscribe(spy);
    const btn: HTMLButtonElement = fixture.nativeElement.querySelector('button');
    btn.click();
    expect(spy).toHaveBeenCalled();
  });
});
