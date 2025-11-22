import { Component, OnInit } from '@angular/core';
import { FoodData } from '../../services/food-data';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-foods',
  standalone: true,
  imports: [RouterModule],
  providers: [FoodData],
  templateUrl: './foods.component.html',
  styleUrl: './foods.component.css',
})
export class FoodsComponent implements OnInit {

  food_list: any = [];
  page: number = 1;

  constructor(public foodData: FoodData) {}

  ngOnInit() {
    if (sessionStorage['page']) {
      this.page = Number(sessionStorage['page']);
    }
    this.food_list = this.foodData.getFoods(this.page);
  }

  previousPage() {
    if (this.page > 1) {
      this.page--;
      sessionStorage['page'] = this.page;
      this.food_list = this.foodData.getFoods(this.page);
    }
  }

  nextPage() {
    if (this.page < this.foodData.getLastPageNumber()) {
      this.page++;
      sessionStorage['page'] = this.page;
      this.food_list = this.foodData.getFoods(this.page);
    }
  }
}
