'use client';

import { useEffect, useState } from 'react';
import { type Bounty } from '../types';
import { contractService } from '../lib/ContractService';
import { useWallet } from '../context/AppContext';
import SubmitWork from './SubmitWork';
import ApproveBounty from './ApproveBounty';
import CancelBounty from './CancelBounty';
import { shortenAddress, getStatusColor, getStatusText, formatNumberScale } from '../lib/helper-functions';

interface BountyListProps {
  refreshTrigger?: number;
  onRefresh?: () => void;
}

export default function BountyList({ refreshTrigger, onRefresh }: BountyListProps) {
  const [bounties, setBounties] = useState<Bounty[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [bountyCount, setBountyCount] = useState<number | null>(null);
  const { address, isConnected } = useWallet();

  const loadBounties = async () => {
    try {
      setLoading(true);
      setError(null);

      const count = await contractService.getBountyCount();
      setBountyCount(count);

      const allBounties: Bounty[] = await contractService.getAllBounties();

      // If no bounties loaded from contract, show sample data for UI testing
      if (allBounties.length === 0) {
        const sampleBounties: Bounty[] = [
          {
            id: 0,
            client: "0x742d35Cc6567C0535E5F1B6b6c6c23c8a5b6c7d8",
            worker: "0x0000000000000000000000000000000000000000",
            reward: "1.500",
            description: "Build a React component for user authentication with email and password fields. Include form validation, error handling, and responsive design. The component should integrate with our existing API endpoints.",
            submissionLink: "",
            status: 0
          },
          {
            id: 1,
            client: "0x8f3d42c5E7b9A1d6F2c8B4a9E6d5C7f3B2a9E1c4",
            worker: "0x5a2b8c9d1e3f7a4b6c8d9e2f5a7b3c9d1e6f8a2b",
            reward: "2.750",
            description: "Create a smart contract for a decentralized voting system. The contract should allow users to create proposals, vote on them, and tally results. Include proper access controls and event emissions.",
            submissionLink: "https://github.com/user/voting-contract",
            status: 1
          }
        ];
        setBounties(sampleBounties);
      } else {
        setBounties(allBounties);
      }
    } catch (err: any) {
      console.error('Failed to load bounties:', err);
      setError(err.message || 'Failed to load bounties');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isConnected) {
      loadBounties();
    }
  }, [isConnected, refreshTrigger]);

  if (!isConnected) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500">Please connect your wallet to view bounties</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-xl p-8 text-center shadow-lg max-w-2xl mx-auto" style={{ backgroundColor: 'var(--secondary)' }}>
        <p className="font-bold mb-4" style={{fontSize: 'clamp(1.25rem, 3vw, 1.5rem)', color: 'var(--primary)'}}>
          ERROR LOADING BOUNTIES
        </p>

        <p className="mb-6" style={{fontSize: 'clamp(0.875rem, 1.5vw, 1rem)', color: 'var(--text-secondary)'}}>
          {error}
        </p>

        <button onClick={loadBounties} style={{backgroundColor: 'var(--primary)', color: 'var(--secondary)'}}
          className="px-6 py-3 rounded-lg font-semibold transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
        >
          RETRY
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="text-center mb-12">
        <h2 className="font-black tracking-tight mb-4" style={{fontSize: 'clamp(2.5rem, 6vw, 4rem)', color: 'var(--primary)'}}>
          TASKMINT BOUNTIES
        </h2>

        {bountyCount !== null && (
          <p className="font-medium" style={{fontSize: 'clamp(1rem, 2vw, 1.25rem)', color: 'var(--text-secondary)'}}>
            Total Bounties: {bountyCount}
          </p>
        )}
      </div>
      
      {loading ?
        <div className="text-center py-16">
          <div className="animate-spin rounded-full h-12 w-12 border-b-4 mx-auto mb-4" style={{ borderColor: 'var(--primary)' }}
          ></div>

          <p style={{fontSize: 'clamp(1rem, 2vw, 1.125rem)', color: 'var(--text-secondary)'}}>
            LOADING BOUNTIES...
          </p>
        </div>
      :
      bounties.length === 0 ?
        <div className="text-center py-16">
          <p className="font-medium" style={{fontSize: 'clamp(1.25rem, 3vw, 1.5rem)', color: 'var(--text-secondary)'}}>
            NO BOUNTIES FOUND
          </p>

          <p className="mt-2" style={{fontSize: 'clamp(0.875rem, 1.5vw, 1rem)', color: 'var(--text-secondary)'}}>
            Be the first to create a bounty!
          </p>
        </div>
      :
        <div className="grid grid-cols-3 gap-8">
          {bounties.map((bounty) => (
            <div key={bounty.id} className="flex flex-col gap-y-4 rounded-xl p-6 shadow hover:shadow-md bg-gray-50">
              {/* Bounty Header */}
              <section className="flex justify-between items-start">
                <div className="space-y-1 font-medium">
                  <p className="">
                    Creator:

                    <span className="font-mono ml-2" style={{ color: 'var(--text-secondary)' }}>
                      {shortenAddress(bounty.client)}
                    </span>
                  </p>

                    <p className="">
                      Assigned To:

                    <span className="font-mono ml-2" style={{ color: 'var(--text-secondary)' }}>
                      {bounty.worker !== null ? shortenAddress(bounty.worker) : null}
                    </span>
                  </p>
                </div>

                <div className="flex flex-col items-end space-y-2">
                  <span className={`pill ${getStatusColor(bounty.status)}`}>{getStatusText(bounty.status)}</span>
                </div>
              </section>

              <div className="text-right font-black text-4xl">
                {formatNumberScale(bounty.reward)} STX
              </div>

              {/* Description Section */}
              <section className="flex-1">
                <h4 className="font-bold uppercase"> Description </h4>
                
                <div className="p-3 rounded-lg bg-white">{bounty.description || 'No description provided'}</div>
              </section>

              {bounty.submissionLink && (
                <div className="">
                  <h4 className="font-semibold uppercase">SUBMISSION:</h4>
                  
                  <a href={bounty.submissionLink} target="_blank" rel="noopener noreferrer"
                    className="font-mono underline hover:no-underline transition-colors break-all"
                  >
                    {bounty.submissionLink}
                  </a>
                </div>
              )}

              {/* Actions Section */}
              <section className="border-t border-gray-300 pt-6" style={{ borderColor: 'var(--text-secondary)' }}>
                {(() => {
                  const canSubmitWork = bounty.status === 0 && bounty.client.toLowerCase() !== address?.toLowerCase();
                  const canApprove = bounty.client.toLowerCase() === address?.toLowerCase() && bounty.status === 1 && bounty.submissionLink && bounty.worker !== null;
                  const canCancel = bounty.client.toLowerCase() === address?.toLowerCase() && bounty.status === 0;
                  const hasActions = canSubmitWork || canApprove || canCancel;

                  return (
                    <div className="space-y-4">
                      {hasActions && (
                        <div className="flex items-center mb-4">
                          <h4 className="font-bold uppercase tracking-wide mr-3" style={{fontSize: 'clamp(0.875rem, 1.5vw, 1rem)', color: 'var(--primary)'}}>
                            Available Actions
                          </h4>

                          {/* Action indicators */}
                          {bounty.status === 0 && bounty.client.toLowerCase() !== address?.toLowerCase() && (
                            <span className="pill" style={{backgroundColor: '#3b82f6', color: 'white'}}>
                              SUBMIT WORK
                            </span>
                          )}

                          {bounty.client.toLowerCase() === address?.toLowerCase() && bounty.status === 1 && bounty.submissionLink && (
                            <span className="pill" style={{backgroundColor: '#16a34a', color: 'white'}}>
                              APPROVE WORK
                            </span>
                          )}

                          {bounty.client.toLowerCase() === address?.toLowerCase() && bounty.status === 0 && (
                            <span className="pill" style={{backgroundColor: '#dc2626', color: 'white'}}>
                              CANCEL BOUNTY
                            </span>
                          )}
                        </div>
                      )}

                      <SubmitWork bounty={bounty} onSuccess={() => onRefresh?.()} />
                      <ApproveBounty bounty={bounty} onSuccess={() => onRefresh?.()} />
                      <CancelBounty bounty={bounty} onSuccess={() => onRefresh?.()} />

                      {!hasActions && (() => {
                        let message = '';
                        let nextStep = '';

                        if (bounty.status === 2) {
                          message = 'This bounty has been completed and paid out.';
                          nextStep = '🎉 Bounty completed successfully!';
                        } else if (bounty.status === 3) {
                          message = 'This bounty has been cancelled.';
                          nextStep = '💰 Funds have been refunded to the creator.';
                        } else if (bounty.status === 1) {
                          if (bounty.client.toLowerCase() === address?.toLowerCase()) {
                            message = 'A worker has submitted work for your approval.';
                            nextStep = '✅ Review and approve the submission above.';
                          } else {
                            message = 'Work has been submitted and is awaiting approval.';
                            nextStep = '⏳ Waiting for creator approval.';
                          }
                        } else if (bounty.client.toLowerCase() === address?.toLowerCase()) {
                          message = 'You created this bounty and it\'s waiting for submissions.';
                          nextStep = '👥 Share this bounty to attract skilled workers!';
                        } else {
                          message = 'This bounty is open for submissions.';
                          nextStep = '💻 Submit your work to earn the reward!';
                        }

                        return (
                          <div>
                            <h4 className="font-bold uppercase tracking-wide">Status</h4>

                            <div className="text-center p-5 rounded-lg space-y-2 bg-white">
                              <p className="text-gray-500">{message}</p>

                              <p className="text-gray-900 font-bold">{nextStep}</p>
                            </div>
                          </div>
                        );
                      })()}
                    </div>
                  );
                })()}
              </section>
            </div>
          ))}
        </div>
      }
    </div>
  );
}