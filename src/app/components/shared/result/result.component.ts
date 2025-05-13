import { Component, input } from '@angular/core';

@Component({
  selector: 'juegos-result',
  imports: [],
  templateUrl: './result.component.html',
  styleUrl: './result.component.scss',
})
export class ResultComponent {
  public score = input.required<number>();
  public success = input<number>(0);
  public showSuccess = input<boolean>(true);
}
