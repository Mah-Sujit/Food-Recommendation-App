import { Routes } from '@angular/router';
import { Home } from './home/home';
import { FoodsComponent } from './components/foods/foods.component';
import { FoodComponent } from './components/food/food.component';

export const routes: Routes = [

  {
    path: '',
    component: Home
  },

  {
    path: 'foods',
    component: FoodsComponent
  },

  {
    path: 'foods/:id',
    component: FoodComponent
  }

];
