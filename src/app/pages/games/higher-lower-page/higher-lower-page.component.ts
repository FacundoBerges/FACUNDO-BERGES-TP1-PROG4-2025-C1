import { Component } from '@angular/core';

import { HigherLowerComponent } from '../../../components/games/higher-lower/higher-lower.component';

@Component({
  selector: 'juegos-higher-lower-page',
  imports: [HigherLowerComponent],
  templateUrl: './higher-lower-page.component.html',
  styleUrl: './higher-lower-page.component.scss',
})
export class HigherLowerPageComponent {}
