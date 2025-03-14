import { TestBed } from '@angular/core/testing';

import { ScheduleSessionsService } from './schedule-sessions.service';

describe('ScheduleSessionsService', () => {
  let service: ScheduleSessionsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ScheduleSessionsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
