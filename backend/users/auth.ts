import { api, APIError } from "encore.dev/api";
import { usersDB } from "./encore.service";
import { randomBytes, scryptSync } from "crypto";

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
  user: {
    id: string;
    username: string;
    email: string;
    isAnonymous: boolean;
    createdAt: Date;
    updatedAt: Date;
  };
  token: string;
}

interface User {
  id: string;
  username: string;
  email: string;
  isAnonymous: boolean;
  createdAt: Date;
  updatedAt: Date;
}

//Key a new user
export const register = api<RegisterParams, AuthResponseData>(
  { expose: true, method: "POST", path: "/auth/register" },
  async ({ username, email, password }) => {
    // Check if user already exists
    const existingUser = await usersDB.queryRow`
      SELECT id FROM users WHERE email = ${email}
    `;
    
    if (existingUser) {
      throw APIError.alreadyExists("User with this email already exists");
    }
    
    // Hash password
    const salt = randomBytes(16).toString('hex');
    const hashedPassword = scryptSync(password, salt, 64).toString('hex') + ':' + salt;
    
    // Create user
    const userResult = await usersDB.queryRow<User>`
      INSERT INTO users (username, email, password_hash, is_anonymous)
      VALUES (${username}, ${email}, ${hashedPassword}, false)
      RETURNING id, username, email, is_anonymous as "isAnonymous", created_at as "createdAt", updated_at as "updatedAt"
    `;
    
    if (!userResult) {
      throw APIError.internal("Failed to create user");
    }
    
    // Create session
    const token = randomBytes(32).toString('hex');
    const expiresAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000); // 30 days
    
    await usersDB.exec`
      INSERT INTO sessions (user_id, token, expires_at)
      VALUES (${userResult.id}, ${token}, ${expiresAt})
    `;
    
    return {
      user: userResult,
      token
    };
  }
);

// Login user
export const login = api<LoginParams, AuthResponseData>(
  { expose: true, method: "POST", path: "/auth/login" },
  async ({ email, password }) => {
    // Find user by email
    const userResult = await usersDB.queryRow<{id: string, passwordHash: string}>`
      SELECT id, password_hash as "passwordHash" FROM users WHERE email = ${email}
    `;
    
    if (!userResult) {
      throw APIError.notFound("User not found");
    }
    
    // Verify password
    const [hashedPassword, salt] = userResult.passwordHash.split(':');
    const derivedHash = scryptSync(password, salt, 64).toString('hex');
    
    if (hashedPassword !== derivedHash) {
      throw APIError.unauthenticated("Invalid password");
    }
    
    // Get full user details
    const user = await usersDB.queryRow<User>`
      SELECT id, username, email, is_anonymous as "isAnonymous", created_at as "createdAt", updated_at as "updatedAt"
      FROM users WHERE id = ${userResult.id}
    `;
    
    if (!user) {
      throw APIError.internal("Failed to retrieve user");
    }
    
    // Create session
    const token = randomBytes(32).toString('hex');
    const expiresAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000); // 30 days
    
    await usersDB.exec`
      INSERT INTO sessions (user_id, token, expires_at)
      VALUES (${user.id}, ${token}, ${expiresAt})
    `;
    
    return {
      user,
      token
    };
  }
);

// Logout user
export const logout = api<{ token: string }, { success: boolean }>(
  { expose: true, method: "POST", path: "/auth/logout" },
  async ({ token }) => {
    await usersDB.exec`
      DELETE FROM sessions WHERE token = ${token}
    `;
    
    return {
      success: true
    };
  }
);

// Get current user
export const getCurrentUser = api<undefined, User>(
  { expose: true, method: "GET", path: "/auth/me" },
  async () => {
    // This will be handled by auth middleware
    // For now, we'll return a placeholder
    throw APIError.unimplemented("Not implemented");
  }
);