import { Routes } from '@angular/router';

import { authGuard } from './guards/auth.guard';

export const routes: Routes = [
  {
    path: '',
    title: 'Juegos - Inicio',
    loadComponent: () => import('./pages/home-page/home-page.component').then((c) => c.HomePageComponent),
  },
  {
    path: 'about',
    title: 'Juegos - Sobre mí',
    loadComponent: () => import('./pages/about-page/about-page.component').then((c) => c.AboutPageComponent),
  },
  {
    path: 'login',
    title: 'Juegos - Iniciar sesión',
    loadComponent: () => import('./pages/login-page/login-page.component').then((c) => c.LoginPageComponent),
  },
  {
    path: 'register',
    title: 'Juegos - Registrarse',
    loadComponent: () => import('./pages/register-page/register-page.component').then((c) => c.RegisterPageComponent),
  },
  {
    path: 'games',
    title: 'Juegos',
    canActivateChild: [authGuard],
    children: [
      {
        path: 'hangman',
        title: 'Juegos - Ahorcado',
        loadComponent: () => import('./pages/games/hangman-page/hangman-page.component').then((c) => c.HangmanPageComponent),
      },
      {
        path: 'higher-lower',
        title: 'Juegos - Mayor o menor',
        loadComponent: () => import(
            './pages/games/higher-lower-page/higher-lower-page.component').then((c) => c.HigherLowerPageComponent),},
      {
        path: 'trivia',
        title: 'Juegos - Preguntados',
        loadComponent: () => import('./pages/games/trivia-page/trivia-page.component').then((c) => c.TriviaPageComponent),
      },
      {
        path: '2048',
        title: 'Juegos - 2048',
        loadComponent: () => import('./pages/games/twenty-forty-eight-page/twenty-forty-eight-page.component').then((c) => c.TwentyFortyEightPageComponent),
      },
      {
        path: '**',
        redirectTo: '',
      },
    ],
  },
  {
    path: '**',
    redirectTo: '',
  },
];
