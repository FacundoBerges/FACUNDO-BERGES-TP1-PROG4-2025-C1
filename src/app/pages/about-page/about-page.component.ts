import { Component, inject, OnInit, signal } from '@angular/core';

import { UserDataComponent } from '../../components/user-data/user-data.component';
import { UserInfoComponent } from '../../components/user-info/user-info.component';
import { GithubService } from '../../services/github.service';
import { GithubUser } from '../../interfaces/github-user';

@Component({
  selector: 'juegos-about-page',
  imports: [UserDataComponent, UserInfoComponent],
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
