export interface User {
  id: string;
  email: string;
  name: string;
  avatarColor: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface AuthResponse {
  user: User;
  token?: string;
}
