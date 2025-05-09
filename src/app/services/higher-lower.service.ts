import { Injectable, signal, WritableSignal } from '@angular/core';

import { shuffle } from 'underscore';

import { ranks, suits } from '../helpers/deck';

@Injectable({
  providedIn: 'root',
})
export class HigherLowerService {
  public deck: WritableSignal<string[]> = signal<string[]>([]);
  public lastCard: WritableSignal<string> = signal<string>('');
  public currentCard: WritableSignal<string> = signal<string>('');

  private _initializeDeck(): void {
    let deck: string[] = [];

    for (const suit of suits) {
      for (const rank of ranks) {
        deck.push(`${rank}${suit}`);
      }
    }

    const shuffledDeck = shuffle<string[]>(deck);

    this.deck.set(shuffledDeck);
    const firstCard: string = this.drawCard();

    this.lastCard.set(firstCard);
    this.currentCard.set(firstCard);
  }

  public newDeck(): void {
    this._initializeDeck();
  }

  public drawCard(): string {
    if (this.deck().length === 0) throw new Error('No more cards in the deck');

    return this.deck().pop()!;
  }

  public getCardValue(card: string): number {
    const rank: string = card.slice(0, -1);

    if (rank === 'A') return 1;
    if (rank === 'J') return 11;
    if (rank === 'Q') return 12;
    if (rank === 'K') return 13;
    return parseInt(rank);
  }
}
