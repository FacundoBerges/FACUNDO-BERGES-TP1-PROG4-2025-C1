import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class HangmanService {
  private _words: string[] = [
    'HANGMAN',
    'ANGULAR',
    'TYPESCRIPT',
    'JAVASCRIPT',
    'PROGRAMMING',
    'DEVELOPER',
    'COMPUTER',
    'SOFTWARE',
    'APPLICATION',
    'GAMES',
    'FRONTEND',
    'BACKEND',
    'FULLSTACK',
    'PERFORMANCE',
    'RESPONSIVE',
    'ACCESSIBILITY',
    'USABILITY',
    'ARCHITECTURE',
    'DATABASE',
    'SERVER',
    'NETWORK',
    'SECURITY',
    'PROTOCOL',
    'ALGORITHM',
    'DATA',
    'STRUCTURE',
    'ANALYSIS',
    'TESTING',
    'DEBUGGING',
    'DEPLOYMENT',
    'GITHUB',
    'AGILE',
    'SCRUM',
    'DEVOPS',
    'CONTINUOUS INTEGRATION',
    'CONTINUOUS DEPLOYMENT',
    'CLOUD COMPUTING',
    'VIRTUALIZATION',
    'CONTAINERIZATION',
    'MICROSERVICES',
    'API REST',
  ];

  public get randomWord(): string {
    const randomIndex = Math.floor(Math.random() * this._words.length);

    return this._words[randomIndex];
  }
}
