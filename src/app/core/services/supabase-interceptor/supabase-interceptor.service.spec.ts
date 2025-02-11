import { TestBed } from '@angular/core/testing';

import { SupabaseInterceptorService } from './supabase-interceptor.service';

describe('SupabaseInterceptorService', () => {
  let service: SupabaseInterceptorService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SupabaseInterceptorService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
