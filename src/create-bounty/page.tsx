'use client';

import { Link } from 'react-router-dom';

import CreateBounty from '../components/CreateBounty';

export default function CreateBountyPage() {

  const handleSuccess = () => {
    // Redirect to bounties page after successful creation
  };

  return (
    <div className="min-h-screen" style={{ backgroundColor: 'var(--secondary)' }}>
      <div className="max-w-4xl mx-auto px-6 py-12">
        <header className="text-center mb-12">
          <Link to="/" className="inline-block mb-8 font-medium hover:underline transition-colors" style={{ color: 'var(--accent)' }}>
            ← BACK TO HOME
          </Link>

          <h1 className="font-black mb-6 tracking-tight" style={{ fontSize: 'clamp(3rem, 8vw, 5rem)', color: 'var(--primary)', lineHeight: '1.1' }}> CREATE TASKMINT BOUNTY </h1>

          <p className="mb-12 max-w-3xl mx-auto" style={{ fontSize: 'clamp(1.125rem, 2.5vw, 1.5rem)', color: 'var(--text-secondary)' }}>
            Create a TaskMint bounty by staking STX tokens. Skilled workers will compete to complete your task and earn instant payment upon approval.
          </p>
        </header>

        <div className="max-w-2xl mx-auto">
          <CreateBounty onSuccess={handleSuccess} />
        </div>
      </div>
    </div>
  );
}