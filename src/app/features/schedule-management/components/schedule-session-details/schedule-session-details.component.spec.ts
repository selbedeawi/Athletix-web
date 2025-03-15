import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ScheduleSessionDetailsComponent } from './schedule-session-details.component';

describe('ScheduleSessionDetailsComponent', () => {
  let component: ScheduleSessionDetailsComponent;
  let fixture: ComponentFixture<ScheduleSessionDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ScheduleSessionDetailsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ScheduleSessionDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
