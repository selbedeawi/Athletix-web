import { waitForAsync, ComponentFixture, TestBed } from '@angular/core/testing';

import { InputWithValidationPopupComponent } from './input-with-validation';

describe('InputWithValidationPopupComponent', () => {
  let component: InputWithValidationPopupComponent;
  let fixture: ComponentFixture<InputWithValidationPopupComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [InputWithValidationPopupComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InputWithValidationPopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
