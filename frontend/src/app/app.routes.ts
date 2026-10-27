
import { Routes } from '@angular/router';
import { Home } from './home/home';
import { FoodMenu } from './food-menu/food-menu';
import { PlaceOrder } from './place-order/place-order';

export const routes: Routes = [
  { path: '', component: Home },
  { path: 'home', component: Home },
  { path: 'food-menu', component: FoodMenu },
  { path: 'place-order', component: PlaceOrder },
  { path: '**', redirectTo: '' }
];
