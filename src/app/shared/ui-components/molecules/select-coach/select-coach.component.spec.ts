import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SelectCoachComponent } from './select-coach.component';

describe('SelectCoachComponent', () => {
  let component: SelectCoachComponent;
  let fixture: ComponentFixture<SelectCoachComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SelectCoachComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SelectCoachComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
