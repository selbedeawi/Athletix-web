import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SelectComponent } from './select.component';
import { DropdownOptionsModel } from './select.model';

describe('SelectComponent', () => {
  let component: SelectComponent<DropdownOptionsModel>;
  let fixture: ComponentFixture<SelectComponent<DropdownOptionsModel>>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SelectComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(SelectComponent<DropdownOptionsModel>);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
