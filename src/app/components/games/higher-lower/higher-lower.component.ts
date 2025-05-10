import { Component, inject, signal, WritableSignal } from '@angular/core';

import { ButtonComponent } from '../../ui/button/button.component';
import { LowerOrHigher } from '../../../interfaces/lower-higher';
import { HigherLowerService } from '../../../services/higher-lower.service';
import { HigherLowerCardComponent } from './higher-lower-card/higher-lower-card.component';
import { TimerComponent } from '../../shared/timer/timer.component';

@Component({
  selector: 'juegos-higher-lower',
  imports: [HigherLowerCardComponent, ButtonComponent, TimerComponent],
  templateUrl: './higher-lower.component.html',
  styleUrl: './higher-lower.component.scss',
})
export class HigherLowerComponent {
  public CARD_BACK: string = 'grey_back';
  public higherLowerService: HigherLowerService = inject(HigherLowerService);
  public isGameOver: WritableSignal<boolean> = signal<boolean>(false);

  constructor() {
    this.higherLowerService.newDeck();
  }

  public get deck(): string[] {
    return this.higherLowerService.deck();
  }

  public get currentCard(): string {
    return this.higherLowerService.currentCard();
  }

  public get lastCard(): string {
    return this.higherLowerService.lastCard();
  }

  public drawCard(guess: LowerOrHigher): void {
    if (this.isGameOver()) return;

    this.higherLowerService.currentCard.set(this.higherLowerService.drawCard());
    const lastCard: string = this.higherLowerService.lastCard();
    const currentCard: string = this.higherLowerService.drawCard();

    const currentValue: number =
      this.higherLowerService.getCardValue(currentCard);
    const lastValue: number = this.higherLowerService.getCardValue(lastCard);

    this.higherLowerService.lastCard.set(currentCard);

    if (
      (guess === 'higher' && currentValue < lastValue) ||
      (guess === 'lower' && currentValue > lastValue)
    ) {
      this.isGameOver.set(true);
      return;
    }
  }

  public resetGame(): void {
    this.higherLowerService.newDeck();
    this.higherLowerService.drawCard();
    this.isGameOver.set(false);
  }
}
