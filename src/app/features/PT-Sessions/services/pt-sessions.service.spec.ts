import { TestBed } from '@angular/core/testing';

import { PtSessionsService } from './pt-sessions.service';

describe('PtSessionsService', () => {
  let service: PtSessionsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PtSessionsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
