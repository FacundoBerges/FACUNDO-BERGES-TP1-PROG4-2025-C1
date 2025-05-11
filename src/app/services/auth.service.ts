import {
  inject,
  Injectable,
  OnDestroy,
  signal,
  WritableSignal,
} from '@angular/core';
import { Router } from '@angular/router';

import {
  AuthChangeEvent,
  AuthError,
  Session,
  Subscription,
  User,
} from '@supabase/supabase-js';
import { MessageService } from 'primeng/api';

import { SupabaseService } from './supabase.service';
import {
  DatabaseUser,
  UserLoginData,
  UserRegisterData,
} from '../interfaces/user-data';

@Injectable({
  providedIn: 'root',
})
export class AuthService implements OnDestroy {
  private _supabaseService: SupabaseService = inject(SupabaseService);
  private _router: Router = inject(Router);
  private _messageService: MessageService = inject(MessageService);
  private _supabaseSubscription: Subscription;
  public user: WritableSignal<User | null> = signal<User | null>(null);
  public loggedUser: WritableSignal<DatabaseUser | null> =
    signal<DatabaseUser | null>(null);

  constructor() {
    this._supabaseService.supabaseClient.auth
      .getSession()
      .then(async ({ data, error }) => {
        if (error) {
          console.error('Error getting session:', error);
          return;
        }

        if (data.session) {
          this.user.set(data.session.user);

          const user = await this.getUserById(data.session.user.id);

          if (user) this.loggedUser.set(user);
        }
      });

    const { data } = this._handleAuthStateChange();

    this._supabaseSubscription = data.subscription;
  }

  ngOnDestroy(): void {
    if (this._supabaseSubscription) this._supabaseSubscription.unsubscribe();
  }

  private _handleAuthStateChange(): { data: { subscription: Subscription } } {
    return this._supabaseService.supabaseClient.auth.onAuthStateChange(
      (event: AuthChangeEvent, session: Session | null) => {
        if (!session || !session?.user) {
          this.user.set(null);
          this.loggedUser.set(null);
          return;
        }

        this._supabaseService.supabaseClient.auth
          .getUser()
          .then(async ({ data, error }) => {
            this.user.set(data.user);

            if (data.user?.id) {
              const fetchUser = await this.getUserById(data.user.id);

              if (fetchUser) this.loggedUser.set(fetchUser);
            }

            this._router.navigateByUrl('/');
          });
      }
    );
  }

  private async _insertUser(user: UserRegisterData): Promise<DatabaseUser> {
    const { data, error } = await this._supabaseService.supabaseClient
      .from('users')
      .insert({
        id: user.id,
        name: user.name,
        surname: user.surname,
        age: user.age,
        email: user.email,
      })
      .select();

    if (error) {
      console.error('Error inserting user:', error);
      throw error;
    }

    console.info('User inserted successfully:', data);

    return data[0];
  }

  public async getUserById(id: string): Promise<DatabaseUser> {
    const { data, error } = await this._supabaseService.supabaseClient
      .from('users')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      console.error('Error fetching user by ID:', error);
      throw error;
    }

    return {
      id: data.id,
      name: data.name,
      surname: data.surname,
      age: data.age,
      email: data.email,
    };
  }

  public async signUp(user: UserRegisterData): Promise<AuthError | null> {
    const { data, error } =
      await this._supabaseService.supabaseClient.auth.signUp({
        email: user.email,
        password: user.password,
      });

    if (data.user?.id) {
      user.id = data.user.id;
      await this._insertUser(user);
    }

    return error;
  }

  public async signIn(user: UserLoginData): Promise<AuthError | null> {
    const { data, error } =
      await this._supabaseService.supabaseClient.auth.signInWithPassword({
        email: user.email,
        password: user.password,
      });

    return error;
  }

  public async signOut(): Promise<void> {
    const { error } = await this._supabaseService.supabaseClient.auth.signOut();

    if (error) {
      console.error('Error signing out:', error);
      return;
    }

    this._messageService.add({
      severity: 'success',
      summary: 'Success',
      detail: 'Sesión cerrada correctamente!',
    });

    console.info('User signed out successfully');
  }
}
