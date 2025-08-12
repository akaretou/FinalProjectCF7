import { Routes } from '@angular/router';
import { HomePage } from './home/home.component';
import { LoginPage } from './login/login.component';
import { RegisterPage } from './register/register.component';

export const routes: Routes = [
  { path: '', component: HomePage },
  { path: 'login', component: LoginPage },
  { path: 'register', component: RegisterPage },
];
