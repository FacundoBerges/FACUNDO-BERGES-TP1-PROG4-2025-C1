import { Routes } from '@angular/router';

import { HomePageComponent } from './pages/home-page/home-page.component';
import { AboutPageComponent } from './pages/about-page/about-page.component';
import { LoginPageComponent } from './pages/login-page/login-page.component';
import { RegisterPageComponent } from './pages/register-page/register-page.component';

export const routes: Routes = [
  {
    path: '',
    component: HomePageComponent,
  },
  {
    path: 'about',
    title: 'Sobre mí',
    component: AboutPageComponent,
  },
  {
    path: 'login',
    title: 'Iniciar sesión',
    component: LoginPageComponent,
  },
  {
    path: 'register',
    title: 'Registrarse',
    component: RegisterPageComponent,
  },
  {
    path: '**',
    pathMatch: 'full',
    redirectTo: '',
  },
];
