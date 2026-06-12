export interface User {
  id: string;
  name: string;
  email: string;
  createdAt: string;
}

export interface AuthData {
  user: User;
  token: string;
  refreshToken: string;
}
