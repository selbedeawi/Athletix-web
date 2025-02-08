import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RelationToAccountHolderComponent } from './relation-to-account-holder.component';

describe('RelationToAccountHolderComponent', () => {
  let component: RelationToAccountHolderComponent;
  let fixture: ComponentFixture<RelationToAccountHolderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RelationToAccountHolderComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RelationToAccountHolderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
