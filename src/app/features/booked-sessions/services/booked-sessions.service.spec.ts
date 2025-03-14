import { TestBed } from '@angular/core/testing';

import { BookedSessionsService } from './booked-sessions.service';

describe('BookedSessionsService', () => {
  let service: BookedSessionsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(BookedSessionsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
