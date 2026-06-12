import { prisma } from "../../config/prisma";
import { hashPassword, comparePassword } from "../../utils/password";
import {
  generateAccessToken,
  generateRefreshToken,
  verifyRefreshToken,
} from "../../utils/jwt";
import { ApiError } from "../../utils/apiError";
import { RegisterInput, LoginInput } from "./auth.schema";
import { AuthResponse, TokenResponse, UserResponse } from "./auth.types";

export async function register(data: RegisterInput): Promise<AuthResponse> {
  const existingUser = await prisma.user.findUnique({
    where: { email: data.email },
  });

  if (existingUser) {
    throw ApiError.conflict("Email already registered");
  }

  const passwordHash = await hashPassword(data.password);

  const user = await prisma.user.create({
    data: {
      name: data.name,
      email: data.email,
      passwordHash,
    },
  });

  const tokenPayload = { userId: user.id, email: user.email };
  const token = generateAccessToken(tokenPayload);
  const refreshToken = generateRefreshToken(tokenPayload);

  return {
    user: formatUser(user),
    token,
    refreshToken,
  };
}

export async function login(data: LoginInput): Promise<AuthResponse> {
  const user = await prisma.user.findUnique({
    where: { email: data.email },
  });

  if (!user) {
    throw ApiError.unauthorized("Invalid email or password");
  }

  const isPasswordValid = await comparePassword(data.password, user.passwordHash);

  if (!isPasswordValid) {
    throw ApiError.unauthorized("Invalid email or password");
  }

  const tokenPayload = { userId: user.id, email: user.email };
  const token = generateAccessToken(tokenPayload);
  const refreshToken = generateRefreshToken(tokenPayload);

  return {
    user: formatUser(user),
    token,
    refreshToken,
  };
}

export async function refreshToken(refreshTokenStr: string): Promise<TokenResponse> {
  try {
    const payload = verifyRefreshToken(refreshTokenStr);

    const user = await prisma.user.findUnique({
      where: { id: payload.userId },
    });

    if (!user) {
      throw ApiError.unauthorized("User not found");
    }

    const token = generateAccessToken({
      userId: user.id,
      email: user.email,
    });

    return { token };
  } catch (error) {
    if (error instanceof ApiError) throw error;
    throw ApiError.unauthorized("Invalid or expired refresh token");
  }
}

export async function getCurrentUser(userId: string): Promise<UserResponse> {
  const user = await prisma.user.findUnique({
    where: { id: userId },
  });

  if (!user) {
    throw ApiError.notFound("User not found");
  }

  return formatUser(user);
}

function formatUser(user: { id: string; name: string; email: string; createdAt: Date }): UserResponse {
  return {
    id: user.id,
    name: user.name,
    email: user.email,
    createdAt: user.createdAt,
  };
}
