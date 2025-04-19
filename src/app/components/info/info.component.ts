import { Component, input, InputSignal } from '@angular/core';
import { NgOptimizedImage } from '@angular/common';

import { GithubUser } from '../../interfaces/github-user';
import { LoaderComponent } from '../../shared/loader/loader.component';

@Component({
  selector: 'juegos-info',
  imports: [NgOptimizedImage, LoaderComponent],
  templateUrl: './info.component.html',
  styleUrl: './info.component.scss',
})
export class InfoComponent {
  public user: InputSignal<GithubUser | undefined> = input<
    GithubUser | undefined
  >();
}
