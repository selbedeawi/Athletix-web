import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SelectMembershipComponent } from '../select-membership/select-membership.component';


describe('SelectMembershipComponent', () => {
  let component: SelectMembershipComponent;
  let fixture: ComponentFixture<SelectMembershipComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SelectMembershipComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SelectMembershipComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
