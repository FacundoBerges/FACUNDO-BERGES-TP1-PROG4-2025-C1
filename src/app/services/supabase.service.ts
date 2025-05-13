import { Injectable } from '@angular/core';

import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { Database } from '../database/supabase';

import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class SupabaseService {
  private _supabaseUrl: string = environment.supabaseApiUrl;
  private _supabaseKey: string = environment.supabaseApiKey;
  private _supabaseClient: SupabaseClient<any, 'public', any>;

  constructor() {
    this._supabaseClient = createClient<Database>(
      this._supabaseUrl,
      this._supabaseKey
    );
  }

  public get supabaseClient(): SupabaseClient<any, 'public', any> {
    return this._supabaseClient;
  }
}
