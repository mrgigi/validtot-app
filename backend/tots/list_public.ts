import { api } from "encore.dev/api";
import { Query } from "encore.dev/api";
import { totsDB } from "./db";
import { ListTotsResponse, Tot } from "./types";

interface ListPublicParams {
  page?: Query<number>;
  limit?: Query<number>;
  trending?: Query<boolean>;
}

// Retrieves public This or That polls with pagination.
export const listPublic = api<ListPublicParams, ListTotsResponse>(
  { expose: true, method: "GET", path: "/tots/public" },
  async ({ page = 1, limit = 20, trending = false }) => {
    const offset = (page - 1) * limit;
    
    let whereClause = "WHERE is_public = true AND (expires_at IS NULL OR expires_at > NOW())";
    if (trending) {
      whereClause += " AND is_trending = true";
    }

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
        creator_user_id as "creatorUserId",
        is_anonymous as "isAnonymous",
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
      ${whereClause}
      ORDER BY created_at DESC
      LIMIT ${limit} OFFSET ${offset}
    `;

    const totalResult = await totsDB.queryRow<{ count: number }>`
      SELECT COUNT(*) as count FROM tots ${whereClause}
    `;

    return {
      tots,
      total: totalResult?.count || 0,
      page,
      limit
    };
  }
);
