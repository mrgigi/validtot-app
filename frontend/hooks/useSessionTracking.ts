import { useLocalStorage } from './useLocalStorage';
import { nanoid } from 'nanoid';

interface VoteRecord {
  totId: string;
  option: 'A' | 'B' | 'C';
  timestamp: number;
}

interface SessionData {
  sessionId: string;
  votes: VoteRecord[];
  createdTots: string[];
}

export function useSessionTracking() {
  const [sessionData, setSessionData] = useLocalStorage<SessionData>('validtot-session', {
    sessionId: nanoid(16),
    votes: [],
    createdTots: []
  });

  const hasVotedOn = (totId: string): boolean => {
    return sessionData.votes.some(vote => vote.totId === totId);
  };

  const getVoteFor = (totId: string): 'A' | 'B' | 'C' | null => {
    const vote = sessionData.votes.find(vote => vote.totId === totId);
    return vote ? vote.option : null;
  };

  const recordVote = (totId: string, option: 'A' | 'B' | 'C') => {
    setSessionData(prev => ({
      ...prev,
      votes: [
        ...prev.votes.filter(vote => vote.totId !== totId), // Remove any existing vote for this tot
        {
          totId,
          option,
          timestamp: Date.now()
        }
      ]
    }));
  };

  const hasCreated = (totId: string): boolean => {
    return sessionData.createdTots.includes(totId);
  };

  const recordCreation = (totId: string) => {
    setSessionData(prev => ({
      ...prev,
      createdTots: [...prev.createdTots, totId]
    }));
  };

  const getVoteHistory = (): VoteRecord[] => {
    return sessionData.votes.sort((a, b) => b.timestamp - a.timestamp);
  };

  const clearSession = () => {
    setSessionData({
      sessionId: nanoid(16),
      votes: [],
      createdTots: []
    });
  };

  return {
    sessionId: sessionData.sessionId,
    hasVotedOn,
    getVoteFor,
    recordVote,
    hasCreated,
    recordCreation,
    getVoteHistory,
    clearSession
  };
}
