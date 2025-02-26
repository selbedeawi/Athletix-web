import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditMembershipComponent } from './edit-membership.component';

describe('EditMembershipComponent', () => {
  let component: EditMembershipComponent;
  let fixture: ComponentFixture<EditMembershipComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EditMembershipComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EditMembershipComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
