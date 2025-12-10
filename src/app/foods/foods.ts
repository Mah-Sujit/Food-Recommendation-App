import { Component, OnInit } from '@angular/core';
import { FoodData } from '../services/food-data';
import { RouterModule } from '@angular/router';
import { WebServices } from '../services/web-service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';


@Component({
  selector: 'app-foods',
  standalone: true,
  imports: [RouterModule,FormsModule, CommonModule],
  providers: [FoodData, WebServices],
  templateUrl: './foods.html',
  styleUrl: './foods.css',
})
export class Foods implements OnInit {

  food_list: any = [];
  page: number = 1;
  total_pages = 1;
  allFoods: any[] = [];        // Full API result
  filteredFoods: any[] = [];   // Foods after filters applied

  searchQuery: string = "";
  minRating: number | null = null;
  sortBy: 'ratingDesc' | 'ratingAsc' | 'name' = 'ratingDesc';
  
  pageSize: number = 6;
  totalPages: number = 1;


  constructor(public foodData: FoodData, 
    public webService: WebServices) {}

  ngOnInit() { this.loadPage(this.page); 

    if (sessionStorage['page']) {
      this.page = Number(sessionStorage['page']);
    }
    this.webService.getfoods(this.page).subscribe(
      (res:any) => {

    this.food_list = res.items;     
    this.total_pages = res.total_pages; 
      });
   // this.food_list = this.foodData.getFoods(this.page);
   
}

  loadPage(page: number) {
  this.webService.getfoods(page).subscribe((res: any) => {
    this.food_list = res.items;        // matches backend
    this.total_pages = res.total_pages;
  });
}
applyFilters() {
  let list = [...this.allFoods];

  if (this.searchQuery.trim()) {
    const q = this.searchQuery.toLowerCase();
    list = list.filter(f =>
      f.name.toLowerCase().includes(q) ||
      f.city.toLowerCase().includes(q) ||
      f.country.toLowerCase().includes(q)
    );
  }

  if (this.minRating != null) {
    list = list.filter(f => f.rating >= this.minRating!);
  }

  if (this.sortBy === 'ratingDesc') {
    list.sort((a, b) => b.rating - a.rating);
  } else if (this.sortBy === 'ratingAsc') {
    list.sort((a, b) => a.rating - b.rating);
  } else if (this.sortBy === 'name') {
    list.sort((a, b) => a.name.localeCompare(b.name));
  }

  this.totalPages = Math.max(1, Math.ceil(list.length / this.pageSize));
  if (this.page > this.totalPages) this.page = this.totalPages;

  const start = (this.page - 1) * this.pageSize;
  this.filteredFoods = list.slice(start, start + this.pageSize);
}
previousPage(){
    if(this.page > 1){
      this.page = this.page - 1;
       //this.food_list = this.foodData.getfoods(this.page);;
      this.webService.getfoods(this.page).subscribe(
        (response: any) => {
          this.food_list = response;
        }
      )
      sessionStorage['page'] = this.page;
    }
  }

  nextPage() {
    if (this.page< this.foodData.getLastPageNumber()){
      this.page = this.page + 1;
      this.loadPage(this.page);
      this.webService.getfoods(this.page).subscribe(
        (response: any) => {
          this.food_list = response;
        }
      )
      //this.food_list = this.foodData.getfoods(this.page);
      sessionStorage['page'] = this.page;
    }
  }

}

