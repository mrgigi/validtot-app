import { api } from "encore.dev/api";
import { Query } from "encore.dev/api";
import { totsDB } from "./db";
import { ListTotsResponse, Tot } from "./types";

interface SearchParams {
  q: Query<string>;
  page?: Query<number>;
  limit?: Query<number>;
}

// Searches for tots by title and description.
export const search = api<SearchParams, ListTotsResponse>(
  { expose: true, method: "GET", path: "/tots/search" },
  async ({ q, page = 1, limit = 20 }) => {
    const offset = (page - 1) * limit;
    const searchTerm = `%${q.toLowerCase()}%`;
    
    const tots = await totsDB.queryAll<Tot>`
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
      WHERE is_public = true 
        AND (LOWER(title) LIKE ${searchTerm} OR LOWER(description) LIKE ${searchTerm})
      ORDER BY total_votes DESC, created_at DESC
      LIMIT ${limit} OFFSET ${offset}
    `;

    const totalResult = await totsDB.queryRow<{ count: number }>`
      SELECT COUNT(*) as count 
      FROM tots 
      WHERE is_public = true 
        AND (LOWER(title) LIKE ${searchTerm} OR LOWER(description) LIKE ${searchTerm})
    `;

    return {
      tots,
      total: totalResult?.count || 0,
      page,
      limit
    };
  }
);
