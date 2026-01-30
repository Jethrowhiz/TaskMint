'use client';

import { Link } from 'react-router-dom';

import { useState } from 'react';
import BountyList from '../components/BountyList';

export default function BountiesPage() {
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const handleRefresh = () => {
    setRefreshTrigger(prev => prev + 1);
  };

  return (
    <main className="container">
      <header className="mb-12">
        <Link to="/" className="inline-block mb-8 font-medium hover:underline transition-colors" style={{ color: 'var(--accent)' }}>
          ← BACK TO HOME
        </Link>

        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6 mb-8">
          <div>
            <h1 className="font-black tracking-tight mb-4" style={{ fontSize: 'clamp(3rem, 8vw, 5rem)', color: 'var(--primary)', lineHeight: '1.1' }}>
              TASKMINT BOUNTIES
            </h1>

            <p className="max-w-2xl" style={{ fontSize: 'clamp(1.125rem, 2.5vw, 1.5rem)', color: 'var(--text-secondary)' }}>
              Discover TaskMint bounties, submit your work to earn STX tokens, or manage your posted tasks
            </p>

            {/* Action Guide */}
            <div className="mt-6 p-4 rounded-xl max-w-2xl" style={{ backgroundColor: 'var(--secondary)' }}>
              <h3 className="font-bold mb-2" style={{ fontSize: 'clamp(1rem, 2vw, 1.125rem)', color: 'var(--primary)' }}>
                What You Can Do:
              </h3>

              <ul className="space-y-1 text-sm" style={{ color: 'var(--text-secondary)' }}>
                <li>• <strong style={{ color: 'var(--primary)' }}>Submit Work</strong> on open bounties you didn't create</li>
                <li>• <strong style={{ color: '#16a34a' }}>Approve Work</strong> on your bounties with submissions</li>
                <li>• <strong style={{ color: '#dc2626' }}>Cancel</strong> your open bounties to get refunds</li>
              </ul>
            </div>
          </div>

          <Link to="/create-bounty" className="btn px-6 py-3 shadow-lg hover:shadow-xl whitespace-nowrap" style={{ backgroundColor: 'var(--primary)', color: 'var(--secondary)' }}>
            CREATE BOUNTY
          </Link>
        </div>
      </header>

      <BountyList
        refreshTrigger={refreshTrigger}
        onRefresh={handleRefresh}
      />
    </main>
  );
}