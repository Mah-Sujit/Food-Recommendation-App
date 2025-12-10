import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminFoodList } from './admin-food-list.component';

describe('AdminFoodList', () => {
  let component: AdminFoodList;
  let fixture: ComponentFixture<AdminFoodList>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdminFoodList]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdminFoodList);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
