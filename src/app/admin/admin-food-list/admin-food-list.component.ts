import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdminFoodService } from '../services/admin-food/admin-food.service';

@Component({
  selector: 'app-admin-food-list',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './admin-food-list.component.html',
  styleUrls: ['./admin-food-list.component.css'],
})
export class AdminFoodList implements OnInit {
  // If you ever want to use Math in the template, expose it here:
  readonly Math = Math;

  foods: any[] = [];
  total_pages = 0;
  currentPage = 1;

  constructor(private adminFoodService: AdminFoodService) {}

  ngOnInit(): void {
    this.loadFoods();
  }

  loadFoods(page: number = 1): void {
    this.currentPage = page;
    this.adminFoodService.getAllFoods(page).subscribe(
      (res: any) => {
        this.foods = res.items || [];
        this.total_pages = res.total_pages || 0;
      },
      (err) => {
        console.error('Failed to load foods', err);
      }
    );
  }

  prevPage(): void {
    const prev = Math.max(1, this.currentPage - 1);
    this.loadFoods(prev);
  }

  nextPage(): void {
    const next = Math.min(this.total_pages || 1, this.currentPage + 1);
    this.loadFoods(next);
  }

  goToPage(page: number): void {
    if (page >= 1 && page <= this.total_pages) {
      this.loadFoods(page);
    }
  }

  get pages(): number[] {
    return Array.from({ length: this.total_pages }, (_, i) => i + 1);
  }
}