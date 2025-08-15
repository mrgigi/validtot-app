import { api, APIError } from "encore.dev/api";
import { Header } from "encore.dev/api";
import { totsDB } from "./db";
import { VoteRequest, TotResults } from "./types";

interface VoteParams {
  id: string;
  userAgent?: Header<"User-Agent">;
  xForwardedFor?: Header<"X-Forwarded-For">;
  xRealIp?: Header<"X-Real-IP">;
}

// Submits a vote for a This or That poll.
export const vote = api<VoteParams & VoteRequest, TotResults>(
  { expose: true, method: "POST", path: "/tots/:id/vote" },
  async ({ id, option, userAgent, xForwardedFor, xRealIp }) => {
    if (!['A', 'B', 'C'].includes(option)) {
      throw APIError.invalidArgument("Option must be 'A', 'B', or 'C'");
    }

    // Extract IP address from headers
    const voterIp = xRealIp || xForwardedFor?.split(',')[0]?.trim() || 'unknown';

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

    // Check if this IP has already voted on this tot
    const existingVote = await totsDB.queryRow`
      SELECT id FROM votes 
      WHERE tot_id = ${id} AND voter_ip = ${voterIp}
    `;

    if (existingVote) {
      throw APIError.alreadyExists("You have already voted on this tot");
    }

    // Record the vote
    await totsDB.exec`
      INSERT INTO votes (tot_id, option_selected, voter_ip, user_agent, created_at)
      VALUES (${id}, ${option}, ${voterIp}, ${userAgent || null}, ${new Date()})
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
    } else if (option === 'B') {
      await totsDB.exec`
        UPDATE tots 
        SET option_b_votes = option_b_votes + 1, 
            total_votes = total_votes + 1,
            updated_at = ${new Date()}
        WHERE id = ${id}
      `;
    } else if (option === 'C') {
      await totsDB.exec`
        UPDATE tots 
        SET option_c_votes = option_c_votes + 1, 
            total_votes = total_votes + 1,
            updated_at = ${new Date()}
        WHERE id = ${id}
      `;
    }

    // Update trending status based on recent activity
    await updateTrendingStatus(id);

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

    if (!updatedTot) {
      throw APIError.internal("Failed to retrieve updated tot");
    }

    const percentageA = updatedTot.totalVotes > 0 
      ? Math.round((updatedTot.optionAVotes / updatedTot.totalVotes) * 100)
      : 0;
    const percentageB = updatedTot.totalVotes > 0 
      ? Math.round((updatedTot.optionBVotes / updatedTot.totalVotes) * 100)
      : 0;
    const percentageC = updatedTot.totalVotes > 0 
      ? Math.round((updatedTot.optionCVotes / updatedTot.totalVotes) * 100)
      : 0;

    return {
      tot: updatedTot,
      percentageA,
      percentageB,
      percentageC
    };
  }
);

async function updateTrendingStatus(totId: string) {
  // Calculate votes in the last 2 hours
  const twoHoursAgo = new Date(Date.now() - 2 * 60 * 60 * 1000);
  
  const recentVotes = await totsDB.queryRow<{ count: number }>`
    SELECT COUNT(*) as count 
    FROM votes 
    WHERE tot_id = ${totId} AND created_at > ${twoHoursAgo}
  `;

  const recentVoteCount = recentVotes?.count || 0;
  
  // Mark as trending if it has 10+ votes in the last 2 hours
  const isTrending = recentVoteCount >= 10;
  
  await totsDB.exec`
    UPDATE tots 
    SET is_trending = ${isTrending}
    WHERE id = ${totId}
  `;
}
