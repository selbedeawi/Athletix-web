import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddMembershipPopupComponent } from './add-membership-popup.component';

describe('AddMembershipPopupComponent', () => {
  let component: AddMembershipPopupComponent;
  let fixture: ComponentFixture<AddMembershipPopupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddMembershipPopupComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddMembershipPopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
