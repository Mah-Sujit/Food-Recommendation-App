import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { WebServices } from '../services/web-service';
import { ToastService } from '../services/toastservice';

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './admin.html',
  styleUrls: ['./admin.css']
})
export class AdminComponent implements OnInit {

  foods: any[] = [];
  selectedFood: any = null;

  showForm = false;
  isEditing = false;

  constructor(
    private web: WebServices,
    private toast: ToastService
  ) {}

  ngOnInit() {
    this.loadFoods();
  }

  loadFoods() {
    this.web.getfoods(1,).subscribe({
      next: (res: any) => {
        this.foods = res.items;
      },
      error: () => this.toast.error('Failed to load foods')
    });
  }

  openAddForm() {
    this.showForm = true;
    this.isEditing = false;
    this.selectedFood = { name: '', town: '', rating: 0 };
  }

  edit(food: any) {
    this.showForm = true;
    this.isEditing = true;
    this.selectedFood = { ...food };
  }

  saveFood() {
    if (!this.selectedFood.name || !this.selectedFood.town) {
      this.toast.error('Name and town are required');
      return;
    }

    if (this.isEditing) {
      this.web.updateFood(this.selectedFood._id, this.selectedFood).subscribe({
        next: () => {
          this.toast.success('Food updated');
          this.showForm = false;
          this.loadFoods();
        },
        error: () => this.toast.error('Update failed')
      });
    } else {
      this.web.addFood(this.selectedFood).subscribe({
        next: () => {
          this.toast.success('Food added');
          this.showForm = false;
          this.loadFoods();
        },
        error: () => this.toast.error('Add failed')
      });
    }
  }

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

  cancelForm() {
    this.showForm = false;
    this.selectedFood = null;
  }
}
