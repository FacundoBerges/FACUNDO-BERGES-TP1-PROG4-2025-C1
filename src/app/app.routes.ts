import { Routes } from '@angular/router';

import { HomePageComponent } from './pages/home-page/home-page.component';
import { AboutPageComponent } from './pages/about-page/about-page.component';
import { LoginPageComponent } from './pages/login-page/login-page.component';
import { RegisterPageComponent } from './pages/register-page/register-page.component';

export const routes: Routes = [
  {
    path: '',
    title: 'Juegos - Inicio',
    component: HomePageComponent,
  },
  {
    path: 'about',
    title: 'Juegos - Sobre mí',
    component: AboutPageComponent,
  },
  {
    path: 'login',
    title: 'Juegos - Iniciar sesión',
    component: LoginPageComponent,
  },
  {
    path: 'register',
    title: 'Juegos - Registrarse',
    component: RegisterPageComponent,
  },
  {
    path: '**',
    pathMatch: 'full',
    redirectTo: '',
  },
];
