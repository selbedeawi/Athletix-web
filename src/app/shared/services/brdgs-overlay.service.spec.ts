import { TestBed } from '@angular/core/testing';

import { BrdgsOverlayService } from './brdgs-overlay.service';

describe('BrdgsOverlayService', () => {
  let service: BrdgsOverlayService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(BrdgsOverlayService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
