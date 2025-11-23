import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FoodData } from '../../services/food-data';
import { CommonModule } from '@angular/common';
import { GoogleMapsModule } from '@angular/google-maps';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { AuthService } from '@auth0/auth0-angular';

@Component({
  selector: 'app-food',
  standalone: true,
  imports: [CommonModule, GoogleMapsModule, ReactiveFormsModule],
  providers: [FoodData],
  templateUrl: './food.component.html',
  styleUrls: ['./food.component.css'],
})
export class FoodComponent {

  food: any;                // single food object
  map_options: google.maps.MapOptions = {};
  map_locations: any[] = [];

  loremIpsum: any;
  temperature: any;
  weather: any;
  weatherIconURL: any;
  temperatureColour: any;

  reviewForm: any;

  constructor(
    private foodData: FoodData,
    private route: ActivatedRoute,
    private formBuilder: FormBuilder,
    protected authService: AuthService
  ) {}

  ngOnInit() {

    // Build review form
    this.reviewForm = this.formBuilder.group({
      username: ['', Validators.required],
      comment: ['', Validators.required],
      stars: 5
    });

    // Get ID from URL
    const id = Number(this.route.snapshot.paramMap.get('id'));

    // Load the single food object (use getFoods which may return an array or an Observable)
    const foods = this.foodData.getFoods(1);

    const processFood = (food: any) => {
      this.food = food;

      if (!this.food) {
        console.error("Food not found for ID:", id);
        return;
      }

      // Setup map marker
      this.map_locations.push({
        lat: this.food.lat,
        lng: this.food.lng
      });

      this.map_options = {
        mapId: "DEMO_MAP_ID",
        center: { lat: this.food.lat, lng: this.food.lng },
        zoom: 13
      };

      // Load lorem ipsum
      this.foodData.getLoremIpsum(1).subscribe((response: any) => {
        this.loremIpsum = response.text.slice(0, 400);
      });

      // Load weather
      this.foodData.getCurrentWeather(this.food.lat, this.food.lng)
        .subscribe((response: any) => {

          const weatherDescription = response.weather[0].description;
          this.temperature = Math.round(response.main.temp);

          this.weather = weatherDescription[0].toUpperCase() + weatherDescription.slice(1);
          const icon = response.weather[0].icon;

          this.weatherIconURL = `http://openweathermap.org/img/wn/${icon}@4x.png`;
          this.temperatureColour = this.foodData.getTemperatureColour(this.temperature);
        });
    };

    if (foods && typeof (foods as any).subscribe === 'function') {
      // getFoods returned an Observable
      (foods as any).subscribe((list: any[]) => {
        processFood(list.find((f: any) => Number(f.id) === id));
      });
    } else {
      // getFoods returned a synchronous array
      processFood(Array.isArray(foods) ? foods.find((f: any) => Number(f.id) === id) : undefined);
    }
  }

  // Submit review
  onSubmit() {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.foodData.postReview(id, this.reviewForm.value);
    this.reviewForm.reset();
  }

  // Validation helpers
  isInvalid(control: any) {
    return (
      this.reviewForm.controls[control].invalid &&
      this.reviewForm.controls[control].touched
    );
  }

  isUntouched() {
    return (
      this.reviewForm.controls.username.pristine ||
      this.reviewForm.controls.comment.pristine
    );
  }

  isIncomplete() {
    return (
      this.isInvalid('username') ||
      this.isInvalid('comment') ||
      this.isUntouched()
    );
  }
}
