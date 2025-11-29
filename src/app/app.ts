import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Navbar } from './navbar/navbar';
import { Foods } from './foods/foods';      
import { FoodData } from './services/food-data';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, Navbar],
  providers: [FoodData],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected title = 'foodFE';

  constructor(private dataService: FoodData) {}

  ngOnInit() {
    this.dataService.populateReviews();
  }
}
