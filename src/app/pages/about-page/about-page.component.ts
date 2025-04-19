import { Component, inject, OnInit, signal } from '@angular/core';

import { InfoComponent } from '../../components/info/info.component';
import { GithubService } from '../../services/github.service';
import { GithubUser } from '../../interfaces/github-user';

@Component({
  selector: 'juegos-about-page',
  imports: [InfoComponent],
  templateUrl: './about-page.component.html',
  styleUrl: './about-page.component.scss',
})
export class AboutPageComponent implements OnInit {
  private _githubService: GithubService = inject(GithubService);
  private _user = signal<GithubUser | undefined>(undefined);

  ngOnInit(): void {
    this._githubService.getUserInfo().subscribe((user: GithubUser) => {
      this._user.set(user);
    });
  }

  get user(): GithubUser | undefined {
    return this._user();
  }
}
