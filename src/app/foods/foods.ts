import { Component, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { WebServices } from '../services/web-service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-foods',
  standalone: true,
  imports: [RouterModule, FormsModule, CommonModule],
  templateUrl: './foods.html',
  styleUrl: './foods.css',
})
export class Foods implements OnInit {

  allFoods: any[] = [];        // Full list from backend
  filteredFoods: any[] = [];   // Filters + pagination
  searchQuery: string = "";
  minRating: number | null = null;
  sortBy: 'ratingDesc' | 'ratingAsc' | 'name' = 'ratingDesc';

  page: number = 1;
  pageSize: number = 6;
  totalPages: number = 1;

  constructor(
    private webService: WebServices,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      this.searchQuery = params['search'] || "";
      this.minRating = params['minRating'] || null;
      this.sortBy = params['sort'] || "ratingDesc";

      if (this.allFoods.length > 0) {
        this.applyFilters();
      }
    });

    this.loadFoodsFromApi();
  }

  /** LOAD FULL LIST OF FOODS **/
 loadFoodsFromApi() {
  this.webService.getfoods(1, 200).subscribe((res: any) => {
    console.log("RAW FOODS", res.items);
    this.allFoods = (res.items || []).map((item: any) => {
  return {
    _id: item._id,
    name: item.name,
    city: item.city,
    country: item.country,
    rating: item.rating,
    image: item.image || "assets/images/restaurant-default.jpg"
  };
});


    console.log("NORMALIZED FOODS:", this.allFoods);

    this.applyFilters();
  });
}


  /** APPLY SEARCH / FILTER / SORT / PAGINATION **/
  applyFilters() {
    let list = [...this.allFoods];

    // SEARCH
    if (this.searchQuery.trim()) {
      const q = this.searchQuery.toLowerCase();
      list = list.filter(f =>
        (f.name || "").toLowerCase().includes(q) ||
        (f.city || "").toLowerCase().includes(q) ||
        (f.country || "").toLowerCase().includes(q)
      );
    }

    // MIN RATING FILTER
    if (this.minRating != null) {
      list = list.filter(f => f.rating >= this.minRating!);
    }

    // SORT
    if (this.sortBy === 'ratingDesc') {
      list.sort((a, b) => b.rating - a.rating);
    } else if (this.sortBy === 'ratingAsc') {
      list.sort((a, b) => a.rating - b.rating);
    } else if (this.sortBy === 'name') {
      list.sort((a, b) => a.name.localeCompare(b.name));
    }

    // PAGINATION
    this.totalPages = Math.max(1, Math.ceil(list.length / this.pageSize));
    if (this.page > this.totalPages) this.page = this.totalPages;

    const start = (this.page - 1) * this.pageSize;
    this.filteredFoods = list.slice(start, start + this.pageSize);
  }

  /** PAGINATION CONTROLS **/
  nextPage() {
    if (this.page < this.totalPages) {
      this.page++;
      this.applyFilters();
    }
  }

  previousPage() {
    if (this.page > 1) {
      this.page--;
      this.applyFilters();
    }
  }
}
