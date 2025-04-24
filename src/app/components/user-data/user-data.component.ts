import { Component, input, InputSignal } from '@angular/core';
import { NgOptimizedImage } from '@angular/common';

import { GithubUser } from '../../interfaces/github-user';

@Component({
  selector: 'juegos-user-data',
  imports: [NgOptimizedImage],
  templateUrl: './user-data.component.html',
  styleUrl: './user-data.component.scss',
})
export class UserDataComponent {
  public user: InputSignal<GithubUser | undefined> = input<
    GithubUser | undefined
  >();
}
