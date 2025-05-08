import { Component, input, InputSignal } from '@angular/core';

@Component({
  selector: 'juegos-hangman-image',
  imports: [],
  templateUrl: './hangman-image.component.html',
  styleUrl: './hangman-image.component.scss',
})
export class HangmanImageComponent {
  private IMAGE_BASE_PATH: string = '/assets/img/hangman/0.png';
  public imageNumber: InputSignal<number> = input<number>(0);

  public get image(): string {
    const validatedImageNumber = this._validateImageNumber(this.imageNumber());

    return this.IMAGE_BASE_PATH.replace('0', validatedImageNumber.toString());
  }

  private _validateImageNumber(imageNumber: number): number {
    if (imageNumber < 0) return 0;

    if (imageNumber > 9) return 9;

    return imageNumber;
  }
}
