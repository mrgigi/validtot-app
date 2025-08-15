import { api } from "encore.dev/api";
import { Header } from "encore.dev/api";
import { totsDB } from "./db";

interface CheckVoteStatusParams {
  id: string;
  xForwardedFor?: Header<"X-Forwarded-For">;
  xRealIp?: Header<"X-Real-IP">;
}

interface VoteStatusResponse {
  hasVoted: boolean;
  votedOption?: 'A' | 'B' | 'C';
}

// Checks if the current user has already voted on a tot.
export const checkVoteStatus = api<CheckVoteStatusParams, VoteStatusResponse>(
  { expose: true, method: "GET", path: "/tots/:id/vote-status", auth: true },
  async ({ id, xForwardedFor, xRealIp, auth }) => {
    // Extract IP address from headers
    const voterIp = xRealIp || xForwardedFor?.split(',')[0]?.trim() || 'unknown';

    let existingVote;
    if (auth?.uid) {
      // If user is authenticated, check by user ID
      existingVote = await totsDB.queryRow<{ option_selected: string }>`
        SELECT option_selected 
        FROM votes 
        WHERE tot_id = ${id} AND user_id = ${auth.uid}
      `;
    } else {
      // If user is not authenticated, check by IP (backward compatibility)
      existingVote = await totsDB.queryRow<{ option_selected: string }>`
        SELECT option_selected 
        FROM votes 
        WHERE tot_id = ${id} AND voter_ip = ${voterIp}
      `;
    }

    if (existingVote) {
      return {
        hasVoted: true,
        votedOption: existingVote.option_selected as 'A' | 'B' | 'C'
      };
    }

    return {
      hasVoted: false
    };
  }
);
