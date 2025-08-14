import { api, APIError } from "encore.dev/api";
import { Header } from "encore.dev/api";
import { totsDB } from "./db";
import { CreateTotRequest, Tot } from "./types";
import { nanoid } from "nanoid";
import { authHandler } from "~backend/users/encore.service";

interface CreateTotParams extends CreateTotRequest {
  xForwardedFor?: Header<"X-Forwarded-For">;
  xRealIp?: Header<"X-Real-IP">;
  isAnonymous?: boolean;
}

// Creates a new This or That poll.
export const create = api<CreateTotParams, Tot>(
  { expose: true, method: "POST", path: "/tots", auth: true },
  async (req) => {
    const id = nanoid(10);
    const now = new Date();
    const expiresAt = req.expiresAt || new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000); // 1 week from now

    // Extract IP address from headers
    const creatorIp = req.xRealIp || req.xForwardedFor?.split(',')[0]?.trim() || 'unknown';

    if (!req.title.trim()) {
      throw APIError.invalidArgument("Title is required");
    }

    if (!req.optionAText.trim() || !req.optionBText.trim()) {
      throw APIError.invalidArgument("Both options A and B are required");
    }

    // Validate title and description length
    if (req.title.length > 120) {
      throw APIError.invalidArgument("Title must be 120 characters or less");
    }

    if (req.description && req.description.length > 250) {
      throw APIError.invalidArgument("Description must be 250 characters or less");
    }

    // Validate option text length
    if (req.optionAText.length > 100 || req.optionBText.length > 100) {
      throw APIError.invalidArgument("Option text must be 100 characters or less");
    }

    if (req.optionCText && req.optionCText.length > 100) {
      throw APIError.invalidArgument("Option text must be 100 characters or less");
    }

    // Check if user is authenticated
    let creatorUserId: string | null = null;
    let isAnonymous = req.isAnonymous ?? true; // Default to anonymous for backward compatibility

    // If user is authenticated, use their ID
    if (req.auth?.uid) {
      creatorUserId = req.auth.uid;
      isAnonymous = req.isAnonymous ?? false; // Default to not anonymous for authenticated users
    }

    await totsDB.exec`
      INSERT INTO tots (
        id, title, description, option_a_text, option_a_image_url,
        option_b_text, option_b_image_url, option_c_text, option_c_image_url,
        creator_ip, creator_user_id, is_anonymous, is_public, created_at, updated_at, expires_at
      ) VALUES (
        ${id}, ${req.title}, ${req.description || null}, ${req.optionAText},
        ${req.optionAImageUrl || null}, ${req.optionBText}, ${req.optionBImageUrl || null},
        ${req.optionCText || null}, ${req.optionCImageUrl || null},
        ${creatorIp}, ${creatorUserId}, ${isAnonymous}, ${req.isPublic ?? true}, ${now}, ${now}, ${expiresAt}
      )
    `;

    const tot = await totsDB.queryRow<Tot>`
      SELECT 
        id,
        title,
        description,
        option_a_text as "optionAText",
        option_a_image_url as "optionAImageUrl",
        option_b_text as "optionBText",
        option_b_image_url as "optionBImageUrl",
        option_c_text as "optionCText",
        option_c_image_url as "optionCImageUrl",
        creator_ip as "creatorIp",
        is_public as "isPublic",
        is_trending as "isTrending",
        created_at as "createdAt",
        updated_at as "updatedAt",
        expires_at as "expiresAt",
        total_votes as "totalVotes",
        option_a_votes as "optionAVotes",
        option_b_votes as "optionBVotes",
        option_c_votes as "optionCVotes"
      FROM tots 
      WHERE id = ${id}
    `;

    if (!tot) {
      throw APIError.internal("Failed to create tot");
    }

    return tot;
  }
);
