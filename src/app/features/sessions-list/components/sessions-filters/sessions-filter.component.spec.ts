import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SessionsFilterComponent } from './sessions-filter.component';

describe('MembershipFilterComponent', () => {
  let component: SessionsFilterComponent;
  let fixture: ComponentFixture<SessionsFilterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SessionsFilterComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SessionsFilterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
