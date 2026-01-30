export const BountyStatus = {
  Open: 0,
  InProgress: 1,
  Completed: 2,
  Cancelled: 3,
} as const;

export type BountyStatus = (typeof BountyStatus)[keyof typeof BountyStatus];

export interface Bounty {
  id: number;
  client: string;
  worker: string;
  reward: string; // In wei, will be formatted to STX
  description: string;
  submissionLink: string;
  status: BountyStatus;
}

export interface TransactionState {
  status: 'idle' | 'pending' | 'success' | 'error';
  hash?: string;
  error?: string;
}

export interface WalletState {
  address: string | null;
  isConnected: boolean;
  isConnecting: boolean;
  error: string | null;
}