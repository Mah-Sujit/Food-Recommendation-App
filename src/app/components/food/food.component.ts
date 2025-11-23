import { Component, Inject } from '@angular/core';
import { ActivatedRoute,} from '@angular/router';
import {FoodData } from '../../services/food-data';
import { CommonModule } from '@angular/common';
import {GoogleMapsModule} from '@angular/google-maps';
import { ReactiveFormsModule } from '@angular/forms';
import { FormBuilder,Validators } from '@angular/forms';
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
  food: any;
  food_list: any = [];;
  food_lat: any;
  food_lng: any; 
  map_options:google.maps.MapOptions = {}; 
  map_locations: any[] = [ ]
  loremIpsum: any;
  temperature: any;
  weather: any;
  weatherIcon: any;
  weatherIconURL: any;
  temperatureColour: any;
  reviewForm: any;

  constructor (@Inject(FoodData) private foodData: FoodData, 
    private route: ActivatedRoute, 
    private formBuilder: FormBuilder,
    protected authService: AuthService ) {} 

  isInvalid(control:any) { 
      return this.reviewForm.controls[control].invalid && 
      this.reviewForm.controls[control].touched; 
    }
    isUntouched() {
      return this.reviewForm.controls.username.pristine || 
             this.reviewForm.controls.comment.pristine;
            }

    isIncomplete() {
      return this.isInvalid('username') ||
             this.isInvalid('comment') || 
             this.isUntouched();
            }

  
  ngOnInit() {
    this.reviewForm = this.formBuilder.group( {
      username: ['',Validators.required],
      comment: ['',Validators.required],
      stars: 5
    });

     this.food_list = this.foodData.getFood(
       this.route.snapshot.paramMap.get('id'));
     console.log(this.food_list[0]['reviews'])  
    
    this.food_lat = this.food_list[0].location.coordinates[0]; 
    this.food_lng = this.food_list[0].location.coordinates[1];
    
    this.map_locations.push( {
       lat: this.food_lat,
       lng: this.food_lng
       });

    this.map_options = {
      mapId: "DEMO_MAP_ID",
      center: {lat: this.food_lat,
        lng: this.food_lng }, 
    zoom: 13,
   };

   this.foodData.getLoremIpsum(1)
   .subscribe( ( response: any) => {
    this.loremIpsum = response.text.slice(0,400);
    });
    
    this.foodData.getCurrentWeather(this.food_lat, this.food_lng)
    .subscribe( ( response: any) => {
      let weatherResponse = response ['weather'][0]['description'];

      this.temperature = Math.round(response ['main']['temp']);
      this.weather = weatherResponse[0].toUpperCase() + weatherResponse.slice(1);
      this.weatherIcon = response ['weather'][0]['icon'];
      this.weatherIconURL = 'http://openweathermap.org/img/wn/' +
      this.weatherIcon + '@4x.png';
      this.temperatureColour = this.foodData.getTemperatureColour(this.temperature);

  
    });
}
onSubmit() { this.foodData.postReview( 
  this.route.snapshot.paramMap.get('id'), 
  this.reviewForm.value); 
  this.reviewForm.reset(); }
}