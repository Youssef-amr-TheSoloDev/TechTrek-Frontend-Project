import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ExploreBooks } from './explore-books';

describe('ExploreBooks', () => {
  let component: ExploreBooks;
  let fixture: ComponentFixture<ExploreBooks>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ExploreBooks],
    }).compileComponents();

    fixture = TestBed.createComponent(ExploreBooks);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
