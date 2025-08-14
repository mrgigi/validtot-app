import { AuthHandler, type AuthResponse } from "encore.dev/auth";
import { api, APIError } from "encore.dev/api";
import { Header } from "encore.dev/api";
import { SQLDatabase } from "encore.dev/storage/sqldb";
import { createHash, timingSafeEqual } from "crypto";

// Create database for users
export const usersDB = new SQLDatabase("users", {
  migrations: "./migrations"
});

interface User {
  id: string;
  username: string;
  email: string;
  isAnonymous: boolean;
  createdAt: Date;
  updatedAt: Date;
}

interface Session {
  id: string;
  userId: string;
  token: string;
  expiresAt: Date;
  createdAt: Date;
}

interface RegisterParams {
  username: string;
  email: string;
  password: string;
}

interface LoginParams {
  email: string;
  password: string;
}

interface AuthResponseData {
  user: User;
  token: string;
}

interface AuthRequest {
  email: string;
  password: string;
}

// Auth handler for validating session tokens
export const authHandler = new AuthHandler(
  async (req: { authorization: string }): Promise<AuthResponse> => {
    const token = req.authorization.replace("Bearer ", "");
    
    // Find session in database
    const session = await usersDB.queryRow<Session>`
      SELECT id, user_id as "userId", token, expires_at as "expiresAt", created_at as "createdAt"
      FROM sessions 
      WHERE token = ${token} AND expires_at > NOW()
    `;
    
    if (!session) {
      throw APIError.unauthenticated("Invalid or expired session token");
    }
    
    // Get user associated with session
    const user = await usersDB.queryRow<User>`
      SELECT id, username, email, is_anonymous as "isAnonymous", created_at as "createdAt", updated_at as "updatedAt"
      FROM users 
      WHERE id = ${session.userId}
    `;
    
    if (!user) {
      throw APIError.unauthenticated("User not found");
    }
    
    return {
      uid: user.id,
      authData: { user }
    };
  }
);