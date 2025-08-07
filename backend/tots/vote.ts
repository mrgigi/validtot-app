import { api, APIError } from "encore.dev/api";
import { totsDB } from "./db";
import { VoteRequest, TotResults } from "./types";

interface VoteParams {
  id: string;
}

// Submits a vote for a This or That poll.
export const vote = api<VoteParams & VoteRequest, TotResults>(
  { expose: true, method: "POST", path: "/tots/:id/vote" },
  async ({ id, option }) => {
    if (option !== 'A' && option !== 'B') {
      throw APIError.invalidArgument("Option must be 'A' or 'B'");
    }

    // Check if tot exists and is public
    const tot = await totsDB.queryRow`
      SELECT id, is_public as "isPublic", expires_at as "expiresAt"
      FROM tots 
      WHERE id = ${id}
    `;

    if (!tot) {
      throw APIError.notFound("Tot not found");
    }

    if (!tot.isPublic) {
      throw APIError.permissionDenied("This tot is private");
    }

    if (tot.expiresAt && new Date() > new Date(tot.expiresAt)) {
      throw APIError.failedPrecondition("This tot has expired");
    }

    // Record the vote
    await totsDB.exec`
      INSERT INTO votes (tot_id, option_selected, created_at)
      VALUES (${id}, ${option}, ${new Date()})
    `;

    // Update vote counts
    if (option === 'A') {
      await totsDB.exec`
        UPDATE tots 
        SET option_a_votes = option_a_votes + 1, 
            total_votes = total_votes + 1,
            updated_at = ${new Date()}
        WHERE id = ${id}
      `;
    } else {
      await totsDB.exec`
        UPDATE tots 
        SET option_b_votes = option_b_votes + 1, 
            total_votes = total_votes + 1,
            updated_at = ${new Date()}
        WHERE id = ${id}
      `;
    }

    // Get updated tot with results
    const updatedTot = await totsDB.queryRow`
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

    if (!updatedTot) {
      throw APIError.internal("Failed to retrieve updated tot");
    }

    const percentageA = updatedTot.totalVotes > 0 
      ? Math.round((updatedTot.optionAVotes / updatedTot.totalVotes) * 100)
      : 0;
    const percentageB = updatedTot.totalVotes > 0 
      ? Math.round((updatedTot.optionBVotes / updatedTot.totalVotes) * 100)
      : 0;

    return {
      tot: updatedTot,
      percentageA,
      percentageB
    };
  }
);
