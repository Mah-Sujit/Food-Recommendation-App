import { Routes } from '@angular/router';
import { Home } from './home/home';
import { Foods } from './foods/foods';
import { Food } from './foods/food/food'; 

export const routes: Routes = [

  {
    path: '',
    component: Home
  },

  {
    path: 'foods',
    component: Foods
  },

  {
    path: 'food/:id',
    component: Food
  }

];
