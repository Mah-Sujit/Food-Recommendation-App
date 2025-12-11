import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { WebServices } from '../services/web-service';
import { ToastService } from '../services/toastservice';

declare var bootstrap: any; // IMPORTANT for modal

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './admin.html',
  styleUrls: ['./admin.css']
})
export class AdminComponent implements OnInit {

  foods: any[] = [];
  originalFoods: any[] = []; // for search + reset
  selectedFood: any = null;

  searchText: string = "";   // ✔ REQUIRED
  isEditing = false;

  constructor(
    private web: WebServices,
    private toast: ToastService
  ) { }

  ngOnInit() {
    this.loadFoods();
  }

  // LOAD ALL FOODS
  loadFoods() {
    this.web.getfoods(1, 9999).subscribe({
      next: (res: any) => {
        this.foods = res.items;
        this.originalFoods = res.items; // store original
      },
      error: () => this.toast.error('Failed to load foods')
    });
  }

  // OPEN MODAL
  openModal() {
    const modal = document.getElementById('foodModal');
    const m = new bootstrap.Modal(modal!);
    m.show();
  }

  // CLOSE MODAL
  closeModal() {
    const modal = document.getElementById('foodModal');
    const m = bootstrap.Modal.getInstance(modal!);
    m?.hide();
  }

  // ADD FOOD
  openAddForm() {
    this.isEditing = false;
    this.selectedFood = { name: '', town: '', rating: 0 };
    this.openModal();
  }

  // EDIT FOOD
  edit(food: any) {
    this.isEditing = true;
    this.selectedFood = { ...food };
    this.openModal();
  }

  // SAVE FOOD (ADD or UPDATE)
  saveFood() {
    if (!this.selectedFood.name || !this.selectedFood.town) {
      this.toast.error('Name and town are required');
      return;
    }

    if (this.isEditing) {
      // UPDATE
      this.web.updateFood(this.selectedFood._id, this.selectedFood).subscribe({
        next: () => {
          this.toast.success('Food updated');
          this.closeModal();
          this.loadFoods();
        },
        error: () => this.toast.error('Update failed')
      });

    } else {
      // ADD NEW FOOD
      this.web.addFood(this.selectedFood).subscribe({
        next: () => {
          this.toast.success('Food added');
          this.closeModal();
          this.loadFoods();
        },
        error: () => this.toast.error('Add failed')
      });
    }
  }

  // DELETE FOOD
  delete(food: any) {
    if (!confirm(`Delete ${food.name}?`)) return;

    this.web.deleteFood(food._id).subscribe({
      next: () => {
        this.toast.success('Food deleted');
        this.loadFoods();
      },
      error: () => this.toast.error('Delete failed')
    });
  }

  // ✔ REAL-TIME SEARCH
  applySearch() {
    const q = this.searchText.toLowerCase();

    this.foods = this.originalFoods.filter(f =>
      f.name.toLowerCase().includes(q) ||
      f.town.toLowerCase().includes(q)
    );
  }

  // ✔ SORTING
  applySort(event: any) {
    const value = event.target.value;

    if (value === "name") {
      this.foods = [...this.foods].sort((a, b) => a.name.localeCompare(b.name));
    }
    else if (value === "town") {
      this.foods = [...this.foods].sort((a, b) => a.town.localeCompare(b.town));
    }
    else if (value === "rating") {
      this.foods = [...this.foods].sort((a, b) => b.rating - a.rating);
    }
  }
}
