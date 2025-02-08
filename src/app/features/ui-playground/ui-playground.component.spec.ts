import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UiPlaygroundComponent } from './ui-playground.component';

describe('UiPlaygroundComponent', () => {
  let component: UiPlaygroundComponent;
  let fixture: ComponentFixture<UiPlaygroundComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UiPlaygroundComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UiPlaygroundComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
