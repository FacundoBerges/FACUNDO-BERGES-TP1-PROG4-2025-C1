import { inject, Injectable, OnDestroy, signal, WritableSignal } from '@angular/core';

import { PostgrestError, RealtimeChannel } from '@supabase/supabase-js';

import { SupabaseService } from './supabase.service';
import { AuthService } from './auth.service';
import { FetchedMessage, Message, MessageUser } from '../interfaces/message';

@Injectable({
  providedIn: 'root',
})
export class ChatService implements OnDestroy {
  private _supabaseService: SupabaseService = inject(SupabaseService);
  private _authService: AuthService = inject(AuthService);
  private _realTimeSubscription: RealtimeChannel;
  public messages: WritableSignal<Message[]> = signal<Message[]>([]);

  constructor() {
    this._realTimeSubscription = this._supabaseService.supabaseClient
      .channel('chat')
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'messages' },
        (payload) => {
          console.log('Change received!', { payload });

          if (payload.errors) {
            console.log('Error received!', payload.errors);
            return;
          }

          this._authService.getUserById(payload.new['user_id']).then((user) => {
            this.messages.update((prevMessages) => [
              ...prevMessages,
              {
                id: payload.new['id'],
                created_at: payload.new['created_at'],
                message: payload.new['message'],
                user: {
                  id: user.id,
                  name: user.name,
                  surname: user.surname,
                  email: user.email,
                },
              },
            ]);
          });
        }
      )
      .subscribe();

    this.getMessages();
  }

  ngOnDestroy(): void {
    if (this._realTimeSubscription) {
      this._supabaseService.supabaseClient.removeChannel(
        this._realTimeSubscription
      );
    }
  }

  private _formatMessages(messages: FetchedMessage[]): Message[] {
    console.log('messages', messages);

    return messages.map((message) => ({
      id: message.id,
      created_at: message.created_at,
      message: message.message,
      user: message.users as MessageUser,
    }));
  }

  public async sendMessage(message: string): Promise<void> {
    if (!this._authService.user()) {
      console.error('User not authenticated');
      return;
    }

    if (!message || message.trim() === '') {
      console.error('Message cannot be empty');
      return;
    }

    const { data, error } = await this._supabaseService.supabaseClient
      .from('messages')
      .insert({
        user_id: this._authService.user()!.id,
        message: message,
      });

    if (error) console.error('Error sending message:', error);
    else console.log('Message sent successfully:', data);
  }

  public async getMessages(): Promise<void | PostgrestError> {
    if (!this._authService.user()) {
      console.error('User not authenticated');
      return;
    }

    const { data, error } = await this._supabaseService.supabaseClient
      .from('messages')
      .select('id, message, created_at, users (id, name, surname, email)')
      .order('created_at', { ascending: false })
      .limit(100);

    if (error) {
      console.error('Error fetching messages:', error);
      return error;
    }

    const reversedData: FetchedMessage[] = data.reverse() as unknown as FetchedMessage[]
    const formattedMessages = this._formatMessages(reversedData);

    this.messages.set(formattedMessages);
  }
}
