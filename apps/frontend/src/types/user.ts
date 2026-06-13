import { Role } from "./roles";

export interface User {
  id: string;
  name: string;
  email: string;
  role: Role;
  createdAt: string;
}

export interface AuthData {
  user: User;
  token: string;
  refreshToken: string;
}
