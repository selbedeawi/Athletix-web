import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BranchSelectComponent } from './branch-select.component';

describe('BranchSelectComponent', () => {
  let component: BranchSelectComponent;
  let fixture: ComponentFixture<BranchSelectComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BranchSelectComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BranchSelectComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
