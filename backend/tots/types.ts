export interface Tot {
  id: string;
  title: string;
  description?: string;
  optionAText: string;
  optionAImageUrl?: string;
  optionBText: string;
  optionBImageUrl?: string;
  creatorIp?: string;
  isPublic: boolean;
  isTrending: boolean;
  createdAt: Date;
  updatedAt: Date;
  expiresAt?: Date;
  totalVotes: number;
  optionAVotes: number;
  optionBVotes: number;
}

export interface Vote {
  id: number;
  totId: string;
  optionSelected: 'A' | 'B';
  voterIp?: string;
  userAgent?: string;
  createdAt: Date;
}

export interface CreateTotRequest {
  title: string;
  description?: string;
  optionAText: string;
  optionAImageUrl?: string;
  optionBText: string;
  optionBImageUrl?: string;
  isPublic?: boolean;
  expiresAt?: Date;
}

export interface VoteRequest {
  option: 'A' | 'B';
}

export interface TotResults {
  tot: Tot;
  percentageA: number;
  percentageB: number;
}

export interface ListTotsResponse {
  tots: Tot[];
  total: number;
  page: number;
  limit: number;
}
