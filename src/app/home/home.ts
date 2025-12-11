import { Component, signal, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { FoodData } from '../services/food-data';
import { Footer } from '../footer/footer';
import { CommonModule } from '@angular/common';
import { Food } from '../foods/food/food';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../services/auth-service';  

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [FormsModule, Footer,CommonModule,RouterModule],
  templateUrl: './home.html',
  styleUrls: ['./home.css'],
})
export class Home implements OnInit {
  

  message = signal('Hello! Welcome to Food App.');

  searchQuery: string = '';
  searchResults: any[] = [];

  topRecommendations: any[] = [];
  topFoods: any[] = [];


  constructor(private foodData: FoodData,
     private router: Router,
     public auth: AuthService

  ) {}


  ngOnInit() {
    // Populate topRecommendations from available food data (take first 5 items)
    const allFoods = this.foodData.getFoods(1);
    this.topRecommendations = Array.isArray(allFoods) ? allFoods.slice(0, 5) : [];
    this.setupScrollAnimations();
     this.loadRecommendations();
  }
  loadRecommendations() {
  this.foodData.getFoodsFromApi(1, 50).subscribe((res: any) => {

    console.log("🔥 RAW API RESPONSE:", res);

    if (!res || !res.items || res.items.length === 0) {
      console.error(" ERROR: res.items is empty or undefined");
      return;
    }

    const mappedFoods = res.items.map((item: any, index: number) => {
      console.log(`🔍 Mapping item ${index}:`, item);

      return {
        name: item.name || item.businessName || item.title || "Unknown",
        city: item.city || item.town || item.location || "Unknown city",
        country: item.country || "Unknown country",
        rating: item.rating || 0,
        lat: item.lat,
        lng: item.lng,
        image: this.foodData.getImageForBusiness(item.name) 
               || "assets/images/restaurant-default.jpg"
      };
    });

    console.log("🟦 FULL MAPPED FOODS:", mappedFoods);

    this.topFoods = mappedFoods
      .sort((a: any, b: any) => b.rating - a.rating)
      .slice(0, 3);

    console.log("🟩 FINAL TOP FOODS:", this.topFoods);
  });
}

  // Change message example
  changeMessage() {
    this.message.set('Enjoy delicious food!');
  }

  // Search Logic
  onSearch() {
  if (!this.searchQuery.trim()) return;

  this.router.navigate(['/foods'], {
    queryParams: { search: this.searchQuery }
  });

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
