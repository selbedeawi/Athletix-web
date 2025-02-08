import { TestBed } from '@angular/core/testing';

import { QuestionsApiService } from './questions-api.service';

describe('QuestionsApiService', () => {
  let service: QuestionsApiService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(QuestionsApiService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
