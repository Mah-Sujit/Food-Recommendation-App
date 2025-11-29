import { Component, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { WebServices } from '../services/web-service';

@Component({
  selector: 'app-foods',
  standalone: true,
  imports: [RouterModule],
  providers: [WebServices],
  templateUrl: './foods.html',
  styleUrl: './foods.css',
})
export class Foods implements OnInit {

  food_list: any[] = [];
  page: number = 1;
  total_pages: number = 1;

  constructor(public webService: WebServices) {}

  ngOnInit() {
    // load page from session if available
    if (sessionStorage['page']) {
      this.page = Number(sessionStorage['page']);
    }

    this.loadPage(this.page);
  }

  loadPage(page: number) {
    this.webService.getfoods(page).subscribe((res: any) => {
      this.food_list = res.items;
      this.total_pages = res.total_pages;
      this.page = page;
      sessionStorage['page'] = this.page;
    });
  }

  previousPage() {
    if (this.page > 1) {
      this.loadPage(this.page - 1);
    }
  }

  nextPage() {
    if (this.page < this.total_pages) {
      this.loadPage(this.page + 1);
    }
  }

}
