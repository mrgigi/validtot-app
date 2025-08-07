import { api, APIError } from "encore.dev/api";
import { totsDB } from "./db";
import { CreateTotRequest, Tot } from "./types";
import { nanoid } from "nanoid";

// Creates a new This or That poll.
export const create = api<CreateTotRequest, Tot>(
  { expose: true, method: "POST", path: "/tots" },
  async (req) => {
    const id = nanoid(10);
    const now = new Date();
    const expiresAt = new Date(now.getTime() + 24 * 60 * 60 * 1000); // 24 hours from now

    if (!req.title.trim()) {
      throw APIError.invalidArgument("Title is required");
    }

    if (!req.optionAText.trim() || !req.optionBText.trim()) {
      throw APIError.invalidArgument("Both options A and B are required");
    }

    await totsDB.exec`
      INSERT INTO tots (
        id, title, description, option_a_text, option_a_image_url,
        option_b_text, option_b_image_url, option_c_text, option_c_image_url,
        is_public, created_at, updated_at, expires_at
      ) VALUES (
        ${id}, ${req.title}, ${req.description || null}, ${req.optionAText},
        ${req.optionAImageUrl || null}, ${req.optionBText}, ${req.optionBImageUrl || null},
        ${req.optionCText || null}, ${req.optionCImageUrl || null},
        ${req.isPublic ?? true}, ${now}, ${now}, ${expiresAt}
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
