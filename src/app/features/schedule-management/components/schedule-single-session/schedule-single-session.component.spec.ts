import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ScheduleSingleSessionComponent } from './schedule-single-session.component';

describe('ScheduleSingleSessionComponent', () => {
  let component: ScheduleSingleSessionComponent;
  let fixture: ComponentFixture<ScheduleSingleSessionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ScheduleSingleSessionComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ScheduleSingleSessionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
