import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MembershipFreezeComponent } from './membership-freeze.component';

describe('MembershipFreezeComponent', () => {
  let component: MembershipFreezeComponent;
  let fixture: ComponentFixture<MembershipFreezeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MembershipFreezeComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MembershipFreezeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
