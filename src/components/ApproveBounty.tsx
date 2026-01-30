'use client';

import { useState } from 'react';
import { type Bounty, BountyStatus, type TransactionState } from '../types';
import { contractService } from '../lib/ContractService';
import { useWallet } from '../context/AppContext';
import { formatNumberScale } from '../lib/helper-functions';

interface ApproveBountyProps {
  bounty: Bounty;
  onSuccess?: () => void;
}

export default function ApproveBounty({ bounty, onSuccess }: ApproveBountyProps) {
  const [txState, setTxState] = useState<TransactionState>({ status: 'idle' });
  const { address } = useWallet();

  // Only show for bounties created by the user that have submissions
  if (
    bounty.client.toLowerCase() !== address?.toLowerCase() ||
    bounty.status !== BountyStatus.InProgress ||
    !bounty.submissionLink ||
    bounty.worker === null
  ) {
    return null;
  }

  const handleApprove = async () => {
    setTxState({ status: 'pending' });

    try {
      const tx = await contractService.approveWork(bounty.id, address!);

      setTxState({ status: 'success', hash: tx.txId });

      // Notify parent
      onSuccess?.();

    } catch (error: any) {
      console.error('Failed to approve bounty:', error);
      setTxState({
        status: 'error',
        error: error.reason || error.message || 'Failed to approve bounty'
      });
    }
  };

  if (txState.status === 'success') {
    return (
      <div
        className="rounded-xl p-6 text-center shadow-lg"
        style={{ backgroundColor: 'var(--secondary)' }}
      >
        <div
          className="text-4xl mb-3"
          style={{ color: 'var(--primary)' }}
        >
          ✓
        </div>
        <h4
          className="font-bold mb-3"
          style={{
            fontSize: 'clamp(1.125rem, 2vw, 1.25rem)',
            color: 'var(--primary)'
          }}
        >
          BOUNTY APPROVED!
        </h4>
        <p
          className="mb-3"
          style={{
            fontSize: 'clamp(0.875rem, 1.5vw, 1rem)',
            color: 'var(--text-secondary)'
          }}
        >
          {formatNumberScale(bounty.reward)} STX paid to worker
        </p>
        {txState.hash && (
          <p
            className="font-mono"
            style={{
              fontSize: 'clamp(0.75rem, 1.25vw, 0.875rem)',
              color: 'var(--text-secondary)'
            }}
          >
            TX: {txState.hash.slice(0, 6)}...{txState.hash.slice(-4)}
          </p>
        )}
      </div>
    );
  }

  return (
    <div className="border-t border-gray-300 pt-6" style={{ borderColor: 'var(--text-secondary)' }}>
      <div
        className="rounded-lg p-4 mb-4"
        style={{ backgroundColor: 'rgba(245, 158, 11, 0.1)' }}
      >
        <p
          className="font-medium mb-2"
          style={{
            fontSize: 'clamp(0.875rem, 1.5vw, 1rem)',
            color: '#d97706'
          }}
        >
          WORKER SUBMITTED:
        </p>
        <a
          href={bounty.submissionLink}
          target="_blank"
          rel="noopener noreferrer"
          className="font-mono underline hover:no-underline transition-colors break-all"
          style={{
            fontSize: 'clamp(0.875rem, 1.5vw, 1rem)',
            color: 'var(--accent)'
          }}
        >
          {bounty.submissionLink}
        </a>
      </div>

      {txState.status === 'error' && (
        <div
          className="rounded-lg p-4 text-center mb-4"
          style={{ backgroundColor: 'rgba(239, 68, 68, 0.1)' }}
        >
          <p
            style={{
              fontSize: 'clamp(0.875rem, 1.5vw, 1rem)',
              color: '#dc2626'
            }}
          >
            {txState.error}
          </p>
        </div>
      )}

      <button onClick={handleApprove} disabled={txState.status === 'pending'}
        className="btn w-full py-4 rounded-xl font-semibold transition-all duration-300 shadow hover:shadow-lg"
        style={{backgroundColor: '#16a34a', color: 'white', opacity: txState.status === 'pending' ? 0.7 : 1}}
      >
        {txState.status === 'pending' ? (
          <div className="flex items-center justify-center">
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-3"></div>
            APPROVING...
          </div>
        ) : (
          `APPROVE & PAY ${formatNumberScale(bounty.reward)} STX`
        )}
      </button>

      {txState.status === 'pending' && txState.hash && (
        <div className="text-center mt-4">
          <a
            href={`https://explorer.hiro.so/txid/${txState.hash}?chain=testnet`}
            target="_blank"
            rel="noopener noreferrer"
            className="font-mono underline hover:no-underline transition-colors"
            style={{
              fontSize: 'clamp(0.75rem, 1.25vw, 0.875rem)',
              color: 'var(--accent)'
            }}
          >
            View transaction on Stacks Explorer →
          </a>
        </div>
      )}
    </div>
  );
}