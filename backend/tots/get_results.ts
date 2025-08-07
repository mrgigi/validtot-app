import { api, APIError } from "encore.dev/api";
import { totsDB } from "./db";
import { TotResults } from "./types";

interface GetResultsParams {
  id: string;
}

// Retrieves the voting results for a This or That poll.
export const getResults = api<GetResultsParams, TotResults>(
  { expose: true, method: "GET", path: "/tots/:id/results" },
  async ({ id }) => {
    const tot = await totsDB.queryRow`
      SELECT 
        id,
        title,
        description,
        option_a_text as "optionAText",
        option_a_image_url as "optionAImageUrl",
        option_b_text as "optionBText",
        option_b_image_url as "optionBImageUrl",
        creator_ip as "creatorIp",
        is_public as "isPublic",
        is_trending as "isTrending",
        created_at as "createdAt",
        updated_at as "updatedAt",
        expires_at as "expiresAt",
        total_votes as "totalVotes",
        option_a_votes as "optionAVotes",
        option_b_votes as "optionBVotes"
      FROM tots 
      WHERE id = ${id}
    `;

    if (!tot) {
      throw APIError.notFound("Tot not found");
    }

    if (!tot.isPublic) {
      throw APIError.permissionDenied("This tot is private");
    }

    const percentageA = tot.totalVotes > 0 
      ? Math.round((tot.optionAVotes / tot.totalVotes) * 100)
      : 0;
    const percentageB = tot.totalVotes > 0 
      ? Math.round((tot.optionBVotes / tot.totalVotes) * 100)
      : 0;

    return {
      tot,
      percentageA,
      percentageB
    };
  }
);
