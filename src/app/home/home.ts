import { Component, signal, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { FoodData } from '../services/food-data';
import { Footer } from '../footer/footer';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [FormsModule, Footer,CommonModule],
  templateUrl: './home.html',
  styleUrls: ['./home.css'],
})
export class Home implements OnInit {

  message = signal('Hello! Welcome to Food App.');

  searchQuery: string = '';
  searchResults: any[] = [];

  topRecommendations: any[] = [];

  constructor(private foodData: FoodData) {}

  ngOnInit() {
    // Populate topRecommendations from available food data (take first 5 items)
    const allFoods = this.foodData.getFoods(1);
    this.topRecommendations = Array.isArray(allFoods) ? allFoods.slice(0, 5) : [];
    this.setupScrollAnimations();
  }

  // Change message example
  changeMessage() {
    this.message.set('Enjoy delicious food!');
  }

  // Search Logic
  onSearch() {
    const q = this.searchQuery.toLowerCase();

    this.searchResults = this.foodData.getFoods(1).filter((item: any) =>
      item.name?.toLowerCase().includes(q) ||
      item.town?.toLowerCase().includes(q) ||
      item.cuisine?.toLowerCase().includes(q)
    );

    console.log('Search results:', this.searchResults);
  }

  // Scroll Animation Setup
  setupScrollAnimations() {
    const elements = document.querySelectorAll('.scroll-animate');

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('animate-show');
        }
      });
    });

    elements.forEach(el => observer.observe(el));
  }
}
