export interface Message {
  id?: string;
  created_at?: Date;
  message: string;
  user: MessageUser;
}

export interface MessageUser {
  id: string;
  name: string;
  surname: string;
  email: string;
}

export interface FetchedMessage {
  id: string;
  message: string;
  created_at: Date;
  users: {
    id: string;
    name: string;
    surname: string;
    email: string;
  };
}
