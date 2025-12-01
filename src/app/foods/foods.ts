import { Component, OnInit } from '@angular/core';
import { FoodData } from '../services/food-data';
import { RouterModule } from '@angular/router';
import { WebServices } from '../services/web-service';


@Component({
  selector: 'app-foods',
  standalone: true,
  imports: [RouterModule],
  providers: [FoodData, WebServices],
  templateUrl: './foods.html',
  styleUrl: './foods.css',
})
export class Foods implements OnInit {

  food_list: any = [];
  page: number = 1;
  total_pages = 1;

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

