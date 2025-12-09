import { Routes } from '@angular/router';
import { Home } from './home/home';
import { Foods } from './foods/foods';
import { Food } from './foods/food/food'; 
import { Login } from './login/login';

import { authGuard } from './guards/auth-guard';
import { guestGuard } from './guards/guest-guard';

export const routes: Routes = [

  {
    path: '',
    component: Home
  },

  {
    path: 'Foods',
    component: Foods
  },

  {
    path: 'food/:id',
    component: Food,
    canActivate: [authGuard]
  },
  { path: 'foods', 
    component: Foods,
    canActivate: [authGuard]
   },
   {
  path: 'contact',
  loadComponent: () =>
    import('./contact/contact').then(m => m.Contact)
  },
   {
    path:'login',
    component: Login,
    canActivate: [guestGuard]
    },
{
  path: 'signup',
  loadComponent: () =>
    import('./signup/signup').then(m => m.SignupComponent),
  canActivate: [guestGuard]
}


];
