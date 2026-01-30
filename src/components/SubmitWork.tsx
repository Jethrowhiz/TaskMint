'use client';

import { useState } from 'react';
import { type Bounty, BountyStatus, type TransactionState } from '../types';
import { contractService } from '../lib/ContractService';
import { useWallet } from '../context/AppContext';

interface SubmitWorkProps {
  bounty: Bounty;
  onSuccess?: () => void;
}

export default function SubmitWork({ bounty, onSuccess }: SubmitWorkProps) {
  const [submissionLink, setSubmissionLink] = useState('');
  const [txState, setTxState] = useState<TransactionState>({ status: 'idle' });
  const { address } = useWallet();

  // Only show for open bounties that the user didn't create
  if (bounty.status !== BountyStatus.Open || bounty.client.toLowerCase() === address?.toLowerCase()) {
    return null;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!submissionLink.trim()) {
      setTxState({ status: 'error', error: 'Please provide a submission link' });
      return;
    }

    // Basic URL validation
    try {
      new URL(submissionLink.trim());
    } catch {
      setTxState({ status: 'error', error: 'Please provide a valid URL' });
      return;
    }

    setTxState({ status: 'pending' });

    try {
      const tx = await contractService.submitWork(bounty.id, submissionLink.trim(), address!);

      setTxState({ status: 'success', hash: tx.hash });

      // Reset form
      setSubmissionLink('');

      // Notify parent
      onSuccess?.();

    } catch (error: any) {
      console.error('Failed to submit work:', error);
      setTxState({
        status: 'error',
        error: error.reason || error.message || 'Failed to submit work'
      });
    }
  };

  const resetForm = () => {
    setTxState({ status: 'idle' });
    setSubmissionLink('');
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
          WORK SUBMITTED SUCCESSFULLY!
        </h4>
        {txState.hash && (
          <p
            className="font-mono mb-4"
            style={{
              fontSize: 'clamp(0.875rem, 1.5vw, 1rem)',
              color: 'var(--text-secondary)'
            }}
          >
            TX: {txState.hash.slice(0, 6)}...{txState.hash.slice(-4)}
          </p>
        )}
        <button
          onClick={resetForm}
          className="px-4 py-2 rounded-lg font-semibold transition-all duration-300 transform hover:scale-105"
          style={{
            backgroundColor: 'var(--primary)',
            color: 'var(--secondary)'
          }}
        >
          SUBMIT ANOTHER
        </button>
      </div>
    );
  }

  return (
    <div className="border-t border-gray-300 pt-6" style={{ borderColor: 'var(--text-secondary)' }}>
      <h4
        className="font-bold mb-4 uppercase tracking-wide"
        style={{
          fontSize: 'clamp(0.875rem, 1.5vw, 1rem)',
          color: 'var(--primary)'
        }}
      >
        Submit Your Work
      </h4>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <input
            type="url"
            value={submissionLink}
            onChange={(e) => setSubmissionLink(e.target.value)}
            placeholder="https://github.com/username/repo or https://example.com/work"
            className="w-full px-4 py-3 rounded-lg border-2 focus:outline-none focus:ring-0 transition-all duration-300"
            style={{
              borderColor: 'var(--text-secondary)',
              backgroundColor: 'var(--background)',
              color: 'var(--text-primary)',
              fontSize: 'clamp(0.875rem, 1.5vw, 1rem)'
            }}
            required
          />
          <p
            className="mt-2"
            style={{
              fontSize: 'clamp(0.75rem, 1.25vw, 0.875rem)',
              color: 'var(--text-secondary)'
            }}
          >
            Link to your completed work (GitHub repo, live demo, etc.)
          </p>
        </div>

        {txState.status === 'error' && (
          <div
            className="rounded-lg p-4 text-center"
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

        <button type="submit" disabled={txState.status === 'pending'}
          className="btn w-full py-4 rounded-xl font-semibold transition-all duration-300 shadow hover:shadow-lg"
          style={{backgroundColor: 'var(--primary)', color: 'var(--secondary)', opacity: txState.status === 'pending' ? 0.7 : 1}}
        >
          {txState.status === 'pending' ? (
            <div className="flex items-center justify-center">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 mr-3" style={{ borderColor: 'var(--secondary)' }}></div>
              SUBMITTING WORK...
            </div>
          ) : (
            'SUBMIT WORK'
          )}
        </button>

        {txState.status === 'pending' && txState.hash && (
          <div className="text-center">
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
      </form>
    </div>
  );
}