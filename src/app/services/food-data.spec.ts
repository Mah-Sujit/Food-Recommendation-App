import { TestBed } from '@angular/core/testing';
import { FoodData } from './food-data';

describe('BusinessData', () => {
  let service: FoodData;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FoodData);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  // Optional: example test using the methods
  it('should return a page of businesses', () => {
    const page1 = service.getFoods(1);
    expect(page1.length).toBeGreaterThan(0);
  });
});
