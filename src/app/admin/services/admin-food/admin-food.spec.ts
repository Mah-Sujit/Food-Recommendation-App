import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminFood } from './admin-food';

describe('AdminFood', () => {
  let component: AdminFood;
  let fixture: ComponentFixture<AdminFood>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdminFood]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdminFood);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
