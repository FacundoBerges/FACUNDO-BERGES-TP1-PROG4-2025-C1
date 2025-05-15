import { Component, computed, inject, Signal } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterModule } from '@angular/router';

import { MenuItem } from '../../../interfaces/menu-item';
import { AuthService } from '../../../services/auth.service';

const noLoginMenu: MenuItem[] = [
  { name: 'Inicio', path: '/' },
  { name: 'Sobre mí', path: '/about' },
  { name: 'Resultados', path: '/score' },
  { name: 'Registrarse', path: '/register' },
  { name: 'Iniciar sesión', path: '/login' },
];

const loggedMenu: MenuItem[] = [
  { name: 'Inicio', path: '/' },
  { name: 'Sobre mí', path: '/about' },
  { name: 'Resultados', path: '/score' },
  { name: 'Cerrar sesión', path: '/logout' },
];

@Component({
  selector: 'juegos-header',
  imports: [RouterLink, RouterLinkActive, RouterModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss',
})
export class HeaderComponent {
  public authService: AuthService = inject(AuthService);
  public menuItems: Signal<MenuItem[]> = computed(() => {
    return this.authService.user() ? [...loggedMenu] : [...noLoginMenu];
  });
}
