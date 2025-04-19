import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterModule } from '@angular/router';

import { MenuItem } from '../../interfaces/menu-item';

@Component({
  selector: 'juegos-header',
  imports: [RouterLink, RouterLinkActive, RouterModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss',
})
export class HeaderComponent {
  private _menuItems: MenuItem[] = [
    { name: 'Inicio', path: '/' },
    { name: 'Sobre mí', path: '/about' },
    { name: 'Registrarse', path: '/register' },
    { name: 'Iniciar sesión', path: '/login' },
  ];

  get menuItems(): MenuItem[] {
    return [...this._menuItems];
  }
}
