import { ComponentFixture, TestBed } from "@angular/core/testing";

import { MemberPassConfirmComponent } from "./member-pass-confirm.component";

describe("MemberPassConfirmComponent", () => {
  let component: MemberPassConfirmComponent;
  let fixture: ComponentFixture<MemberPassConfirmComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MemberPassConfirmComponent],
    })
      .compileComponents();

    fixture = TestBed.createComponent(MemberPassConfirmComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
