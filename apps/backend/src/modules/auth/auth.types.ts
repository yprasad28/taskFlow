import { Role } from "../../types/roles";

export interface UserResponse {
  id: string;
  name: string;
  email: string;
  role: Role;
  createdAt: Date;
}

export interface AuthResponse {
  user: UserResponse;
  token: string;
  refreshToken: string;
}

export interface TokenResponse {
  token: string;
}
