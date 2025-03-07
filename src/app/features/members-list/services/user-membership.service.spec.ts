import { TestBed } from '@angular/core/testing';

import { UserMembershipService } from './user-membership.service';

describe('UserMembershipService', () => {
  let service: UserMembershipService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(UserMembershipService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
