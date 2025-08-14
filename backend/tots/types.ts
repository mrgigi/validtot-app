export interface Tot {
  id: string;
  title: string;
  description?: string;
  optionAText: string;
  optionAImageUrl?: string;
  optionBText: string;
  optionBImageUrl?: string;
  optionCText?: string;
  optionCImageUrl?: string;
  creatorIp?: string;
  creatorUserId?: string;
  isAnonymous?: boolean;
  isPublic: boolean;
  isTrending: boolean;
  createdAt: Date;
  updatedAt: Date;
  expiresAt?: Date;
  totalVotes: number;
  optionAVotes: number;
  optionBVotes: number;
  optionCVotes: number;
}

export interface Vote {
  id: number;
  totId: string;
  optionSelected: 'A' | 'B' | 'C';
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
  optionCText?: string;
  optionCImageUrl?: string;
  isPublic?: boolean;
  isAnonymous?: boolean;
  expiresAt?: Date;
}

export interface VoteRequest {
  option: 'A' | 'B' | 'C';
}

export interface TotResults {
  tot: Tot;
  percentageA: number;
  percentageB: number;
  percentageC: number;
}

export interface ListTotsResponse {
  tots: Tot[];
  total: number;
  page: number;
  limit: number;
}
