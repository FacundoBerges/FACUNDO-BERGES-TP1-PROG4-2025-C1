export interface UserLoginData {
  id?: string;
  email: string;
  password: string;
}

export interface UserRegisterData {
  id?: string;
  name: string;
  surname: string;
  age: number;
  email: string;
  password: string;
}

export interface DatabaseUser {
  id: string;
  name: string;
  surname: string;
  age: number;
  email: string;
}
