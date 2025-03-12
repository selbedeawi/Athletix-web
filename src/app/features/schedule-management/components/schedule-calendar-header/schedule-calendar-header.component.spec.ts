import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ScheduleCalendarHeaderComponent } from './schedule-calendar-header.component';

describe('ScheduleCalendarHeaderComponent', () => {
  let component: ScheduleCalendarHeaderComponent;
  let fixture: ComponentFixture<ScheduleCalendarHeaderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ScheduleCalendarHeaderComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ScheduleCalendarHeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
