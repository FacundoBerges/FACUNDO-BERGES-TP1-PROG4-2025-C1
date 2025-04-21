import { Component, input, InputSignal } from '@angular/core';
import { NgOptimizedImage } from '@angular/common';

import { GithubUser } from '../../interfaces/github-user';

@Component({
  selector: 'juegos-user-info',
  imports: [NgOptimizedImage],
  templateUrl: './user-info.component.html',
  styleUrl: './user-info.component.scss',
})
export class UserInfoComponent {
  public user: InputSignal<GithubUser | undefined> = input<
    GithubUser | undefined
  >();
}
