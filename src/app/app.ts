import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Navigation } from './navigation/navigation';
import { Foods } from './foods/foods';      
import { FoodData } from './services/food-data';
import { ToastComponent } from './toast/toast';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet,Navigation,ToastComponent],
  providers: [FoodData],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class AppComponent {
  protected title = 'foodFE';

  constructor(private dataService: FoodData) {}

  ngOnInit() {
    this.dataService.populateReviews();
  }
}
