import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BridgesCheckboxComponent } from './bridges-checkbox.component';

describe('BridgesCheckboxComponent', () => {
  let component: BridgesCheckboxComponent;
  let fixture: ComponentFixture<BridgesCheckboxComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BridgesCheckboxComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BridgesCheckboxComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
