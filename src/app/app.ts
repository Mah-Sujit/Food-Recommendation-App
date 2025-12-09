import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Navigation } from './navigation/navigation';
import { Foods } from './foods/foods';      
import { FoodData } from './services/food-data';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet,Navigation],
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
