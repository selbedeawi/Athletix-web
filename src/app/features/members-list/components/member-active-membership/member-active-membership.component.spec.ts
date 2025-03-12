import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MemberActiveMembershipComponent } from './member-active-membership.component';

describe('MemberActiveMembershipComponent', () => {
  let component: MemberActiveMembershipComponent;
  let fixture: ComponentFixture<MemberActiveMembershipComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MemberActiveMembershipComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MemberActiveMembershipComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
