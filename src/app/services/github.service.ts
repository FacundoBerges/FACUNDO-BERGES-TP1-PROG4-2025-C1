import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { GithubUser } from '../interfaces/github-user';

@Injectable({
  providedIn: 'root',
})
export class GithubService {
  private _baseUrl = `https://api.github.com/users/FacundoBerges`;
  private _httpClient: HttpClient = inject(HttpClient);

  public getUserInfo(): Observable<GithubUser> {
    return this._httpClient.get<GithubUser>(`${this._baseUrl}`);
  }
}
