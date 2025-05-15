import { Component, input } from '@angular/core';

@Component({
  selector: 'juegos-score',
  imports: [],
  templateUrl: './score.component.html',
  styleUrl: './score.component.scss',
})
export class ScoreComponent {
  public score = input.required<number>();
  public success = input<number>(0);
  public showSuccess = input<boolean>(true);
}
