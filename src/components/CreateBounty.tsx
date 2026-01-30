'use client';

import { useState } from 'react';
import { contractService } from '../lib/ContractService';
import { type TransactionState } from '../types';
import { useWallet } from '../context/AppContext';
import ConnectButton from '../components/ConnectButton';

interface CreateBountyProps {
  onSuccess?: () => void;
}

export default function CreateBounty({ onSuccess }: CreateBountyProps) {
  const [description, setDescription] = useState('');
  const [reward, setReward] = useState('');
  const [txState, setTxState] = useState<TransactionState>({ status: 'idle' });
  const { isConnected, address } = useWallet();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!description.trim() || !reward || parseFloat(reward) <= 0) {
      setTxState({ status: 'error', error: 'Please fill in all fields with valid values' });
      return;
    }

    setTxState({ status: 'pending' });

    try {
      const tx = await contractService.createBounty(description.trim(), reward, address!);

      setTxState({ status: 'success', hash: tx.txId });

      // Reset form
      setDescription('');
      setReward('');

      // Notify parent
      onSuccess?.();

    } catch (error: any) {
      console.error('Failed to create bounty:', error);
      setTxState({
        status: 'error',
        error: error.reason || error.message || 'Failed to create bounty'
      });
    }
  };

  const resetForm = () => {
    setTxState({ status: 'idle' });
    setDescription('');
    setReward('');
  };

  if (txState.status === 'success') {
    return (
      <div className="rounded-xl p-8 text-center shadow-lg" style={{ backgroundColor: 'var(--secondary)' }}>
        <div className="text-6xl mb-4" style={{ color: 'var(--primary)' }}> ✓ </div>
        <h3 className="font-bold mb-4" style={{fontSize: 'clamp(1.5rem, 3vw, 2rem)', color: 'var(--primary)'}}>
          BOUNTY CREATED SUCCESSFULLY!
        </h3>

        {txState.hash && (
          <p className="mb-6 font-mono" style={{fontSize: 'clamp(0.875rem, 1.5vw, 1rem)', color: 'var(--text-secondary)'}}>
            {txState.hash.slice(0, 10)}...{txState.hash.slice(-8)}
          </p>
        )}

        <button onClick={resetForm}
          className="px-6 py-3 rounded-lg font-semibold transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
          style={{backgroundColor: 'var(--primary)', color: 'var(--secondary)'}}
        >
          CREATE ANOTHER BOUNTY
        </button>
      </div>
    );
  }

  return (
    <div className="rounded-xl p-8 shadow-lg" style={{ backgroundColor: 'var(--secondary)' }}>
      <h2 className="font-bold mb-8 text-center" style={{fontSize: 'clamp(1.75rem, 4vw, 2.5rem)', color: 'var(--primary)'}}>
        CREATE NEW BOUNTY
      </h2>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="description" className="block font-semibold mb-3" style={{fontSize: 'clamp(1rem, 2vw, 1.125rem)', color: 'var(--primary)'}}>
            DESCRIPTION *
          </label>
          
          <textarea id="description" value={description} onChange={(e) => setDescription(e.target.value)}
            placeholder="Describe the task or project you need completed..."
            className="w-full px-4 py-3 rounded-lg border-2 focus:outline-none focus:ring-0 transition-all duration-300"
            style={{borderColor: 'var(--text-secondary)', backgroundColor: 'var(--background)', color: 'var(--text-primary)', fontSize: 'clamp(0.875rem, 1.5vw, 1rem)'}} rows={6} required
          />
        </div>

        <div>
          <label htmlFor="reward" className="block font-semibold mb-3" style={{fontSize: 'clamp(1rem, 2vw, 1.125rem)', color: 'var(--primary)'}}>
            REWARD (STX) *
          </label>

          <input id="reward" type="number" step="0.01" min="0" value={reward} onChange={(e) => setReward(e.target.value)}
            placeholder="0.00" className="w-full px-4 py-3 rounded-lg border-2 focus:outline-none focus:ring-0 transition-all duration-300"
            style={{borderColor: 'var(--text-secondary)', backgroundColor: 'var(--background)', color: 'var(--text-primary)', fontSize: 'clamp(0.875rem, 1.5vw, 1rem)'}}
            required
          />

          <p className="mt-2" style={{fontSize: 'clamp(0.75rem, 1.25vw, 0.875rem)', color: 'var(--text-secondary)'}}>
            Amount in STX that will be paid to the worker upon completion
          </p>
        </div>

        {txState.status === 'error' && (
          <div className="rounded-lg p-4 text-center" style={{ backgroundColor: 'rgba(239, 68, 68, 0.1)', fontSize: 'clamp(0.875rem, 1.5vw, 1rem)', color: '#dc2626' }}>
            {txState.error}
          </div>
        )}

        {!isConnected ? (
          <ConnectButton />
        ) : (
          <button type="submit" disabled={txState.status === 'pending'} className="btn w-full py-4 shadow-lg hover:shadow-xl disabled:shadow-lg"
            style={{backgroundColor: 'var(--primary)', color: 'var(--secondary)',
              opacity: txState.status === 'pending' ? 0.7 : 1
            }}
          >
            {txState.status === 'pending' ? (
              <div className="flex items-center justify-center">
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 mr-3" style={{ borderColor: 'var(--secondary)' }}></div>
                CREATING BOUNTY...
              </div>
            ) : (
              'CREATE BOUNTY'
            )}
          </button>
        )}

        {txState.status === 'pending' && txState.hash && (
          <div className="text-center">
            <p className="mb-2" style={{fontSize: 'clamp(0.875rem, 1.5vw, 1rem)', color: 'var(--text-secondary)'}}>
              Transaction submitted:
            </p>

            <a href={`https://explorer.hiro.so/txid/${txState.hash}?chain=testnet`} target="_blank" rel="noopener noreferrer"
              className="font-mono underline hover:no-underline transition-colors"
              style={{fontSize: 'clamp(0.75rem, 1.25vw, 0.875rem)', color: 'var(--accent)'}}
            >
              {txState.hash.slice(0, 10)}...{txState.hash.slice(-8)}
            </a>
          </div>
        )}
      </form>
    </div>
  );
}