import { Component, input, InputSignal, WritableSignal } from '@angular/core';
import { JsonPipe } from '@angular/common';

import { GithubUser } from '../../interfaces/github-user';

@Component({
  selector: 'juegos-info',
  imports: [JsonPipe],
  templateUrl: './info.component.html',
  styleUrl: './info.component.scss',
})
export class InfoComponent {
  public user: InputSignal<GithubUser | undefined> = input<
    GithubUser | undefined
  >();
}
