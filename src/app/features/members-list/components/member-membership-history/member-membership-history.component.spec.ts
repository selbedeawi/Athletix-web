import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MemberMembershipHistoryComponent } from './member-membership-history.component';

describe('MemberMembershipHistoryComponent', () => {
  let component: MemberMembershipHistoryComponent;
  let fixture: ComponentFixture<MemberMembershipHistoryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MemberMembershipHistoryComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MemberMembershipHistoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
