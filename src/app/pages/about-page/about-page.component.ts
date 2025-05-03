import { Component, inject, OnDestroy, OnInit, signal, WritableSignal } from '@angular/core';

import { Subscription } from 'rxjs';

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
export class AboutPageComponent implements OnInit, OnDestroy {
  private _githubService: GithubService = inject(GithubService);
  private _subscription?: Subscription;
  public user: WritableSignal<GithubUser | undefined> = signal<GithubUser | undefined>(undefined);

  ngOnInit(): void {
    this._subscription = this._githubService
      .getUserInfo()
      .subscribe((user: GithubUser) => {
        this.user.set(user);
      });
  }

  ngOnDestroy(): void {
    if (this._subscription) this._subscription.unsubscribe();
  }
}
