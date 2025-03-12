import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MemberMembershipFormComponent } from './member-membership-form.component';

describe('MemberMembershipFormComponent', () => {
  let component: MemberMembershipFormComponent;
  let fixture: ComponentFixture<MemberMembershipFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MemberMembershipFormComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MemberMembershipFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
