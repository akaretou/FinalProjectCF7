import { Routes } from '@angular/router';
import { HomePage } from './home/home.component';
import { MapPage } from './map/map.component';
import { LoginPage } from './login/login.component';
import { RegisterPage } from './register/register.component';
import { PanelPage } from './panel/panel.component';
import { ProductPage } from './panel/product.component';
import { AuthGuard } from './auth.guard';

export const routes: Routes = [
  { path: '', component: HomePage },
  { path: 'map', component: MapPage },
  { path: 'login', component: LoginPage },
  { path: 'register', component: RegisterPage },
  { path: 'panel', component: PanelPage, canActivate: [AuthGuard]  },
  { path: 'panel/product/:id', component: ProductPage, canActivate: [AuthGuard] },
  { path: 'panel/product/new', component: ProductPage, canActivate: [AuthGuard] },
];
