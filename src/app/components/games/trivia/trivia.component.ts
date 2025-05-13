import {
  Component,
  inject,
  OnInit,
  signal,
  computed,
  OnDestroy,
  EffectRef,
  effect,
} from '@angular/core';

import { MessageService, ToastMessageOptions } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { shuffle } from 'underscore';
import { unescape } from 'he';

import { GameDialogComponent } from '../../shared/game-dialog/game-dialog.component';
import { TimerComponent } from '../../shared/timer/timer.component';
import { ResultComponent } from '../../shared/result/result.component';
import { ButtonComponent } from '../../ui/button/button.component';

import { TriviaResult, TriviaResponse } from '../../../interfaces/trivia';
import { TriviaService } from '../../../services/trivia.service';

type TimerPhase = 'setup' | 'answer' | 'idle' | 'finished';

@Component({
  selector: 'juegos-trivia',
  imports: [
    ToastModule,
    TimerComponent,
    ResultComponent,
    GameDialogComponent,
    ButtonComponent,
  ],
  templateUrl: './trivia.component.html',
  styleUrl: './trivia.component.scss',
})
export class TriviaComponent implements OnInit, OnDestroy {
  private _messageService: MessageService = inject(MessageService);
  private _triviaService: TriviaService = inject(TriviaService);
  private _timeoutRef: ReturnType<typeof setTimeout> | null = null;

  public currentScore = signal<number>(0);
  public triviaQuestions = signal<TriviaResult[]>([]);
  public currentQuestion = signal<TriviaResult | null>(null);
  public currentQuestionIndex = signal<number>(0);
  public correctAnswers = signal<number>(0);
  public isGameOver = signal<boolean>(false);
  public showDialog = signal<boolean>(false);
  public totalQuestions = signal<number>(0);
  public questionOptionsEffectRef: EffectRef | null = null;
  public questionOptions = signal<string[]>([]);

  public currentPhaseTimerDuration = signal<number>(0);
  public isTimerRunning = signal<boolean>(false);
  public currentTimerPhase = signal<TimerPhase>('idle');

  public buttonsDisabled = computed<boolean>(
    () => this.currentTimerPhase() === 'setup' || !this.currentQuestion()
  );

  constructor() {
    this.questionOptionsEffectRef = effect(() => {
      const currentQuestion = this.currentQuestion();

      if (currentQuestion) {
        let options: string[] = [
          ...currentQuestion.incorrect_answers,
          currentQuestion.correct_answer,
        ];

        options = options.map((option) => unescape(option));
        this.questionOptions.set(shuffle(options));
      }
    });
  }

  ngOnInit(): void {
    this._loadTriviaQuestions();
  }

  ngOnDestroy(): void {
    this._clearTimeout();

    if (this.questionOptionsEffectRef) {
      this.questionOptionsEffectRef.destroy();
    }
  }

  public get question(): string {
    const currentQuestion = this.currentQuestion();

    if (!currentQuestion) return '';

    return unescape(currentQuestion.question);
  }

  private _clearTimeout(): void {
    if (this._timeoutRef) {
      clearTimeout(this._timeoutRef);
      this._timeoutRef = null;
    }
  }

  public get gameOverMessage(): string {
    const correctAnswers = this.correctAnswers();
    const totalQuestions = this.totalQuestions();
    const score = this.currentScore();

    if (correctAnswers === 0)
      return 'No has respondido ninguna pregunta correctamente.';

    if (correctAnswers === totalQuestions)
      return `¡Felicidades! Has respondido todas las preguntas correctamente. Total de puntos: ${score}`;

    return `Has respondido ${correctAnswers} de ${totalQuestions} preguntas correctamente!. Total de puntos: ${score}`;
  }

  private _startQuestionCycle(): void {
    this.isTimerRunning.set(false);

    if (this.currentQuestionIndex() >= this.totalQuestions()) {
      this.isGameOver.set(true);
      this.currentTimerPhase.set('finished');
      this.showDialog.set(true);
      this.currentPhaseTimerDuration.set(0);
      this.currentQuestion.set(null);
      return;
    }

    const index = this.currentQuestionIndex();
    this.currentQuestion.set(this.triviaQuestions()[index]);

    this.currentTimerPhase.set('setup');
    this.currentPhaseTimerDuration.set(3000);
    this.isTimerRunning.set(true);
  }

  private _loadTriviaQuestions(): void {
    console.log('Loading trivia questions...');

    this._resetGameStates();

    this._triviaService.getQuestions().subscribe({
      next: (resp: TriviaResponse) => {
        console.log('Trivia questions received.');

        this.triviaQuestions.set(resp.results);
        this.totalQuestions.set(resp.results.length);
        this._initializeGame();
      },
      error: (error) => {
        console.error('Error fetching trivia questions:', error);
        this._messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'No se pudieron cargar las preguntas de trivia.',
          life: 3000,
        });
        this.showDialog.set(true);
        this.currentTimerPhase.set('finished');
        this.isTimerRunning.set(false);
        this.currentPhaseTimerDuration.set(0);
        this.currentQuestion.set(null);
        this.currentQuestionIndex.set(0);
        this.correctAnswers.set(0);
        this.triviaQuestions.set([]);
        this.isGameOver.set(true);
        this.currentScore.set(0);
        this.totalQuestions.set(0);
      },
    });
  }

  private _initializeGame(): void {
    this.isGameOver.set(false);
    this.showDialog.set(false);

    this._startQuestionCycle();
  }

  public onTimeout(): void {
    this.isTimerRunning.set(false);

    switch (this.currentTimerPhase()) {
      case 'setup':
        this.currentTimerPhase.set('answer');
        this.currentPhaseTimerDuration.set(10000);
        this.isTimerRunning.set(true);
        break;
      case 'answer':
        this._messageService.add({
          severity: 'error',
          summary: 'Tiempo agotado',
          detail: 'No seleccionaste ninguna respuesta.',
          life: 3000,
        });
        this._timeoutRef = setTimeout(() => {
          this._moveToNextQuestion();
          this._clearTimeout();
        }, 1000);
        break;
      default:
        break;
    }
  }

  public chooseAnswer(answer: string): void {
    if (this.isGameOver()) return;
    if (this.buttonsDisabled()) return;

    this.isTimerRunning.set(false);
    this.currentTimerPhase.set('finished');

    const currentQuestion = this.currentQuestion();
    if (!currentQuestion) return;

    const isCorrectAnswer = currentQuestion.correct_answer === answer;

    const message: ToastMessageOptions = {
      severity: isCorrectAnswer ? 'success' : 'error',
      summary: isCorrectAnswer
        ? '¡Respuesta correcta!'
        : '¡Respuesta incorrecta!',
      detail: `Seleccionaste: ${answer}`,
      life: 3000,
    };

    if (isCorrectAnswer) {
      this.correctAnswers.update((correct) => ++correct);
    }

    const questionNumber = this.currentQuestionIndex() + 1;
    const correctAnswer = this.correctAnswers();
    const score = this._triviaService.calculateScore(
      questionNumber,
      correctAnswer
    );

    this.currentScore.set(score);

    this._messageService.add(message);

    this._timeoutRef = setTimeout(() => {
      this._moveToNextQuestion();
      this._clearTimeout();
    }, 1000);
  }

  private _moveToNextQuestion(): void {
    this._clearTimeout();

    const nextIndex = this.currentQuestionIndex() + 1;
    this.currentQuestionIndex.set(nextIndex);

    if (nextIndex >= this.totalQuestions()) {
      console.log('Game Over');
      const totalQuestions = this.totalQuestions();
      const correctAnswers = this.correctAnswers();

      this._triviaService.saveScore({
        questionsQuantity: totalQuestions,
        correctAnswers: correctAnswers,
      });
      this.isGameOver.set(true);
      this.currentTimerPhase.set('finished');
      this.showDialog.set(true);
      this.currentPhaseTimerDuration.set(0);
      this.currentQuestion.set(null);
      return;
    }

    this._startQuestionCycle();
  }

  private _resetGameStates(): void {
    this._clearTimeout();

    this.isGameOver.set(false);
    this.isTimerRunning.set(false);
    this.currentTimerPhase.set('idle');

    this.currentScore.set(0);
    this.correctAnswers.set(0);
    this.currentQuestion.set(null);
    this.currentQuestionIndex.set(0);
    this.triviaQuestions.set([]);
    this.totalQuestions.set(0);
    this.currentPhaseTimerDuration.set(0);
  }

  public resetGame(): void {
    this.closeDialog();
    this._resetGameStates();
    this._loadTriviaQuestions();
  }

  public closeDialog(): void {
    this.showDialog.set(false);
  }
}
