import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { ApiAuthService } from '../services/auth-service';
import { WebServices } from '../services/web-service';

@Component({
  selector: 'app-client',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './client.html',
  styleUrls: ['./client.css'],
})
export class ClientComponent implements OnInit {

  username: string | null = null;

  // Stats
  totalReviews = 0;
  avgRating = 0;

  // Data
  recentReviews: any[] = [];
  favourites: any[] = [];

  loading = true;

  constructor(
    public auth: ApiAuthService,
    private router: Router,
    private web: WebServices
  ) {}

  ngOnInit() {
    const payload = this.auth.getTokenPayload();
    this.username = payload?.user || 'Guest';

    // TODO: when backend endpoints exist, call them here
    this.loadDashboardData();
  }

  // -----------------------
  // LOAD DASHBOARD DATA
  // -----------------------
  loadDashboardData() {
    // 🔴 TEMP: fake data – replace with real API calls later
    // Example how real version might look:
    // this.web.getUserReviews(this.username!).subscribe(...)

    this.recentReviews = [
      // Example shape; remove when connected to backend
      // { foodName: 'Spicy Ramen', rating: 5, comment: 'Amazing!', createdAt: '2025-12-10' }
    ];

    this.favourites = [
      // { name: '18Grams', city: 'London', country: 'UK', rating: 5 }
    ];

    this.totalReviews = this.recentReviews.length;
    if (this.totalReviews > 0) {
      const sum = this.recentReviews.reduce((acc, r) => acc + (r.rating || 0), 0);
      this.avgRating = Math.round((sum / this.totalReviews) * 10) / 10;
    } else {
      this.avgRating = 0;
    }

    this.loading = false;
  }

  // -----------------------
  // QUICK ACTIONS
  // -----------------------

  goBrowseFoods() {
    this.router.navigate(['/foods']);
  }

  goMyReviews() {
    // later you could route to a dedicated /client/reviews page
    this.router.navigate(['/foods'], { queryParams: { myReviews: true } });
  }

  goFavourites() {
    // For now just scroll to favourites section
    const el = document.getElementById('favourites-section');
    el?.scrollIntoView({ behavior: 'smooth' });
  }

  editProfile() {
    // You can later create /client/profile route
    alert('Profile editing coming soon 🚧');
  }

  writeReview() {
    // Route to foods list – user chooses a restaurant and uses existing review form
    this.router.navigate(['/foods']);
  }

  // Example for future: open a specific restaurant from favourites
  openFoodDetails(food: any) {
    if (!food._id) return;
    this.router.navigate(['/food', food._id]);
  }
}
