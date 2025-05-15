import { Component, HostListener, OnInit, inject, Signal, computed } from '@angular/core';

import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';

import { GameService } from '../../../twenty-forty-eight/core/services/game.service';
import { GridComponent } from '../../../twenty-forty-eight/components/grid/grid.component';
import { MessageComponent } from '../../../twenty-forty-eight/components/message/message.component';
import { TileModel } from '../../../twenty-forty-eight/core/models/tile.model';
import { RestartButtonComponent } from '../../ui/restart-button/restart-button.component';
import { GameExplanationComponent } from '../../shared/game-explanation/game-explanation.component';
import { TimerComponent } from '../../shared/timer/timer.component';
import { ScoreComponent } from '../../shared/score/score.component';
import { GameButtonComponent } from "../../ui/button/game-button.component";
import { GameDialogComponent } from "../../shared/game-dialog/game-dialog.component";
import { TwentyFortyEightService } from '../../../twenty-forty-eight/core/services/twenty-forty-eight.service';

@Component({
  selector: 'juegos-twenty-forty-eight',
  imports: [
    GridComponent,
    MessageComponent,
    RestartButtonComponent,
    GameExplanationComponent,
    TimerComponent,
    ScoreComponent,
    GameButtonComponent, ToastModule,
    GameDialogComponent
],
  templateUrl: './twenty-forty-eight.component.html',
  styleUrl: './twenty-forty-eight.component.scss',
})
export class TwentyFortyEightComponent implements OnInit {
  gameService = inject(GameService);
  messageService = inject(MessageService);
  _twentyFortyEightService = inject(TwentyFortyEightService);
  tiles: Signal<(TileModel | null)[]>;
  currentScore: Signal<number>;
  gameOver: Signal<boolean>;
  won: Signal<boolean>;
  showDialog = computed(() => {
    return this.gameService.gameOver() && !this.gameService.won();
  });
  gridSize: number = 4;

  constructor() {
    this.tiles = this.gameService.tiles.asReadonly();
    this.currentScore = this.gameService.currentScore.asReadonly();
    this.gameOver = this.gameService.gameOver.asReadonly();
    this.won = this.gameService.won.asReadonly();
    this.gridSize = this.gameService.size;
  }

  ngOnInit(): void {
    this.gameService.newGame();
  }

  public get gameOverMessage(): string {
    return `Juego terminado! Tu puntuación es ${this.currentScore()}.`;
  }

  public handleCloseDialog(): void {
    this.gameService.gameOver.set(false);
    this.gameService.won.set(false);
  }

  public newGame(): void {
    this.gameService.newGame();
  }

  public handleRestartGame(): void {
    this.newGame();
  }

  public handleKeepPlaying(): void {
    this.gameService.publicKeepPlaying();
  }

  @HostListener('window:keydown', ['$event'])
  public handleKeyboardEvent(event: KeyboardEvent): void {
    let directionKey: string | undefined = undefined;

    switch (event.key) {
      case 'ArrowUp':
      case 'w':
      case 'W':
        directionKey = 'ArrowUp';
        break;
      case 'ArrowRight':
      case 'd':
      case 'D':
        directionKey = 'ArrowRight';
        break;
      case 'ArrowDown':
      case 's':
      case 'S':
        directionKey = 'ArrowDown';
        break;
      case 'ArrowLeft':
      case 'a':
      case 'A':
        directionKey = 'ArrowLeft';
        break;
    }

    if (directionKey) {
      event.preventDefault();
      this.gameService.move(directionKey);
    }
  }

  handleButton(directionKey: string): void {
    this.gameService.move(directionKey);
  }

  handleTimerEnd(): void {
    this.gameService.gameOver.set(true);
    this._twentyFortyEightService.saveScore({
      score: this.currentScore(),
      moves: this.gameService.moves(),
      remainingTime: 1,
    });
  }

  handleTimerStop(remainingTime: number): void {
    this.gameService.gameOver.set(true);
    this._twentyFortyEightService.saveScore({
      score: this.currentScore(),
      moves: this.gameService.moves(),
      remainingTime: remainingTime,
    });
  }
}
