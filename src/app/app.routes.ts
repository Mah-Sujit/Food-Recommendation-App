import { Routes } from '@angular/router';
import { Home } from './home/home';
import { Foods } from './foods/foods';
import { Food } from './foods/food/food'; 
import { Login } from './login/login';

import { authGuard } from './guards/auth.guard';
import { guestGuard } from './guards/guest.guard';
import { adminGuard } from './guards/admin.guard';

export const routes: Routes = [

  // Home page (public)
  {
    path: '',
    component: Home
  },

  // Foods list (protected)
  {
    path: 'foods',
    component: Foods,
    canActivate: [authGuard]
  },

  // Redirect accidental /Foods to lowercase /foods
  {
    path: 'Foods',
    redirectTo: 'foods',
    pathMatch: 'full'
  },

  // Food details page (protected)
  {
    path: 'food/:id',
    component: Food,
    canActivate: [authGuard]
  },

  // Contact page (public)
  {
    path: 'contact',
    loadComponent: () =>
      import('./contact/contact').then(m => m.Contact)
  },

  // Login page (only for guests)
  {
    path: 'login',
    component: Login,
    canActivate: [guestGuard]
  },

  // Signup page (only for guests)
  {
    path: 'signup',
    loadComponent: () =>
      import('./signup/signup').then(m => m.SignupComponent),
    canActivate: [guestGuard]
  },
  {
  path: 'admin',
  loadComponent: () =>
    import('./admin/admin').then(m => m.AdminComponent),
  canActivate: [authGuard, adminGuard],

  children: [
    {
      path: '',
      redirectTo: 'foods',
      pathMatch: 'full'
    },
   {
  path: 'foods',
  loadComponent: () =>
    import('./admin/admin-food-list/admin-food-list.component')
      .then(m => m.AdminFoodList)
}

  ]

  },

  {
  path: 'client',
  loadComponent: () => import('./client/client').then(m => m.ClientComponent),
  canActivate: [authGuard]  // only logged users
},
{
  path: 'client/form',
  loadComponent: () => import('./clientforms/client-form/client-form')
    .then(m => m.ClientFormComponent),
  canActivate: [authGuard]
},
{
  path: 'clients',
  loadComponent: () => import('./clients/clients')
    .then(m => m.ClientsComponent),
  canActivate: [authGuard] // optional
}

];
