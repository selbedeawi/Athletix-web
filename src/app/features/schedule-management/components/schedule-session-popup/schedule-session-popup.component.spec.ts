import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ScheduleSessionPopupComponent } from './schedule-session-popup.component';

describe('ScheduleSessionPopupComponent', () => {
  let component: ScheduleSessionPopupComponent;
  let fixture: ComponentFixture<ScheduleSessionPopupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ScheduleSessionPopupComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ScheduleSessionPopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
