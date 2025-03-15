import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BookSessionsFillterComponent } from './book-sessions-fillter.component';

describe('BookSessionsFillterComponent', () => {
  let component: BookSessionsFillterComponent;
  let fixture: ComponentFixture<BookSessionsFillterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BookSessionsFillterComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BookSessionsFillterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
