import { Component, inject, OnInit, signal } from '@angular/core';

import { environment } from '../../../environments/environment';

import { Score } from '../../interfaces/score';

import { ScoreService } from '../../services/score.service';

import { ScoresTableComponent } from '../../components/scores-table/scores-table.component';
import { LoaderComponent } from '../../components/shared/loader/loader.component';

@Component({
  selector: 'juegos-scores-page',
  imports: [ScoresTableComponent, LoaderComponent],
  templateUrl: './scores-page.component.html',
  styleUrl: './scores-page.component.scss',
})
export class ScoresPageComponent implements OnInit {
  public scoreService: ScoreService = inject(ScoreService);
  public hangmanScores: Score[] = [];
  public higherLowerScores: Score[] = [];
  public triviaScores: Score[] = [];
  public twentyFortyEightScores: Score[] = [];
  public isLoading = signal(true);

  async ngOnInit(): Promise<void> {
    this.isLoading.set(true);
    [
      this.hangmanScores,
      this.higherLowerScores,
      this.triviaScores,
      this.twentyFortyEightScores,
    ] = await Promise.all([
      this.scoreService.getScores(environment.hangmanId),
      this.scoreService.getScores(environment.higherLowerId),
      this.scoreService.getScores(environment.triviaId),
      this.scoreService.getScores(environment.twentyFortyEightId),
    ]);

    this.isLoading.set(false);
  }
}
