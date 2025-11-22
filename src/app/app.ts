import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NavbarComponent } from './navbar/navbar.component';
import { FoodData } from './services/food-data';

@Component({ 
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, NavbarComponent],
  providers: [FoodData],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected title = 'foodFE';

  constructor(private dataService: FoodData) { }

  ngOnInit() {
    this.dataService.populateReviews();
  }
} 
