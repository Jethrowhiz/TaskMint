'use client';

import { Link } from 'react-router-dom';

import { useWallet } from './context/AppContext';
import ConnectButton from './components/ConnectButton';

export default function App() {
  const { isConnected } = useWallet();

  return (
    <div className="min-h-screen" style={{ backgroundColor: 'var(--secondary)' }}>
      <div className="max-w-7xl mx-auto px-6 py-12">
        {/* Hero Section */}
        <header className="text-center mb-20">
          <h1
            className="font-black mb-6 tracking-tight"
            style={{
              fontSize: 'clamp(3rem, 8vw, 6rem)',
              color: 'var(--primary)',
              lineHeight: '1.1'
            }}
          >
            TASKMINT
          </h1>
          <p
            className="mb-12 max-w-4xl mx-auto leading-relaxed"
            style={{
              fontSize: 'clamp(1.25rem, 3vw, 1.75rem)',
              color: 'var(--text-secondary)'
            }}
          >
            The decentralized bounty platform where clients post tasks and skilled workers earn STX tokens instantly upon completion
          </p>

          {/* Wallet Connection */}
          <div className="mb-12 flex justify-center">
            <ConnectButton />
          </div>

          {isConnected && (
            <div className="space-y-8">
              <div className="flex flex-col sm:flex-row gap-6 justify-center max-w-lg mx-auto">
                <Link
                  to="/create-bounty"
                  className="text-center py-6 px-8 rounded-xl font-bold text-xl transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
                  style={{
                    backgroundColor: 'var(--primary)',
                    color: 'var(--secondary)'
                  }}
                >
                  CREATE BOUNTY
                </Link>

                <Link
                  to="/bounties"
                  className="text-center py-6 px-8 rounded-xl font-bold text-xl transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl border-2"
                  style={{
                    backgroundColor: 'var(--secondary)',
                    color: 'var(--primary)',
                    borderColor: 'var(--primary)'
                  }}
                >
                  BROWSE BOUNTIES
                </Link>
              </div>

              {/* Quick Actions Guide */}
              <div
                className="max-w-2xl mx-auto p-6 rounded-xl text-center"
                style={{ backgroundColor: 'var(--secondary)' }}
              >
                <h3
                  className="font-bold mb-4"
                  style={{
                    fontSize: 'clamp(1.25rem, 3vw, 1.5rem)',
                    color: 'var(--primary)'
                  }}
                >
                  🚀 Ready to Get Started?
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm">
                  <div
                    className="p-3 rounded-lg"
                    style={{ backgroundColor: 'var(--background)' }}
                  >
                    <div className="font-bold text-blue-600 mb-1">💰 Create</div>
                    <div style={{ color: 'var(--text-secondary)' }}>Post bounties for work</div>
                  </div>
                  <div
                    className="p-3 rounded-lg"
                    style={{ backgroundColor: 'var(--background)' }}
                  >
                    <div className="font-bold text-green-600 mb-1">⚡ Submit</div>
                    <div style={{ color: 'var(--text-secondary)' }}>Complete tasks & earn</div>
                  </div>
                  <div
                    className="p-3 rounded-lg"
                    style={{ backgroundColor: 'var(--background)' }}
                  >
                    <div className="font-bold text-purple-600 mb-1">✅ Approve</div>
                    <div style={{ color: 'var(--text-secondary)' }}>Review & pay workers</div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </header>

        {/* Features Section */}
        <section className="mb-20">
          <h2
            className="text-center font-black mb-16 tracking-tight"
            style={{
              fontSize: 'clamp(2rem, 5vw, 3.5rem)',
              color: 'var(--primary)'
            }}
          >
            HOW TASKMINT WORKS
          </h2>

          <div className="grid gap-12 md:grid-cols-3 mb-16">
            <div className="text-center group">
              <div
                className="w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-8 transition-all duration-300 group-hover:scale-110 shadow-lg"
                style={{ backgroundColor: 'var(--primary)' }}
              >
                <span className="text-4xl">💰</span>
              </div>
              <h3
                className="font-bold mb-4"
                style={{
                  fontSize: 'clamp(1.5rem, 3vw, 2rem)',
                  color: 'var(--primary)'
                }}
              >
                CREATE BOUNTY
              </h3>
              <p
                className="leading-relaxed max-w-xs mx-auto mb-4"
                style={{
                  fontSize: 'clamp(1rem, 2vw, 1.125rem)',
                  color: 'var(--text-secondary)'
                }}
              >
                Post detailed task requirements and stake STX tokens as reward in secure escrow
              </p>
              <div
                className="text-sm font-medium"
                style={{ color: 'var(--primary)' }}
              >
                ✅ Secure escrow<br />
                ✅ Detailed descriptions<br />
                ✅ Instant deployment
              </div>
            </div>

            <div className="text-center group">
              <div
                className="w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-8 transition-all duration-300 group-hover:scale-110 shadow-lg"
                style={{ backgroundColor: 'var(--primary)' }}
              >
                <span className="text-4xl">⚡</span>
              </div>
              <h3
                className="font-bold mb-4"
                style={{
                  fontSize: 'clamp(1.5rem, 3vw, 2rem)',
                  color: 'var(--primary)'
                }}
              >
                WORKERS SUBMIT
              </h3>
              <p
                className="leading-relaxed max-w-xs mx-auto mb-4"
                style={{
                  fontSize: 'clamp(1rem, 2vw, 1.125rem)',
                  color: 'var(--text-secondary)'
                }}
              >
                Skilled professionals browse bounties and submit completed work with proof links
              </p>
              <div
                className="text-sm font-medium"
                style={{ color: 'var(--primary)' }}
              >
                🔍 Browse opportunities<br />
                📝 Submit deliverables<br />
                🏆 Compete for rewards
              </div>
            </div>

            <div className="text-center group">
              <div
                className="w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-8 transition-all duration-300 group-hover:scale-110 shadow-lg"
                style={{ backgroundColor: 'var(--primary)' }}
              >
                <span className="text-4xl">✅</span>
              </div>
              <h3
                className="font-bold mb-4"
                style={{
                  fontSize: 'clamp(1.5rem, 3vw, 2rem)',
                  color: 'var(--primary)'
                }}
              >
                APPROVE & PAY
              </h3>
              <p
                className="leading-relaxed max-w-xs mx-auto mb-4"
                style={{
                  fontSize: 'clamp(1rem, 2vw, 1.125rem)',
                  color: 'var(--text-secondary)'
                }}
              >
                Review submissions and instantly release STX tokens to approved workers
              </p>
              <div
                className="text-sm font-medium"
                style={{ color: 'var(--primary)' }}
              >
                ⚡ Instant payments<br />
                🔒 Smart contract security<br />
                📊 On-chain transparency
              </div>
            </div>
          </div>

          {/* User Flow Steps */}
          <div className="max-w-4xl mx-auto">
            <h3
              className="text-center font-bold mb-8"
              style={{
                fontSize: 'clamp(1.5rem, 3vw, 2rem)',
                color: 'var(--primary)'
              }}
            >
              STEP-BY-STEP USER FLOW
            </h3>
            <div className="grid gap-6 md:grid-cols-5">
              <div className="text-center">
                <div
                  className="w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3 font-bold text-lg"
                  style={{ backgroundColor: 'var(--primary)', color: 'var(--secondary)' }}
                >
                  1
                </div>
                <h4 className="font-semibold mb-2" style={{ color: 'var(--primary)' }}>Connect Wallet</h4>
                <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>Link MetaMask & switch to Stacks</p>
              </div>
              <div className="text-center">
                <div
                  className="w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3 font-bold text-lg"
                  style={{ backgroundColor: 'var(--primary)', color: 'var(--secondary)' }}
                >
                  2
                </div>
                <h4 className="font-semibold mb-2" style={{ color: 'var(--primary)' }}>Create/Browse</h4>
                <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>Post tasks or find opportunities</p>
              </div>
              <div className="text-center">
                <div
                  className="w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3 font-bold text-lg"
                  style={{ backgroundColor: 'var(--primary)', color: 'var(--secondary)' }}
                >
                  3
                </div>
                <h4 className="font-semibold mb-2" style={{ color: 'var(--primary)' }}>Submit Work</h4>
                <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>Complete tasks & provide links</p>
              </div>
              <div className="text-center">
                <div
                  className="w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3 font-bold text-lg"
                  style={{ backgroundColor: 'var(--primary)', color: 'var(--secondary)' }}
                >
                  4
                </div>
                <h4 className="font-semibold mb-2" style={{ color: 'var(--primary)' }}>Review & Approve</h4>
                <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>Quality check by bounty creator</p>
              </div>
              <div className="text-center">
                <div
                  className="w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3 font-bold text-lg"
                  style={{ backgroundColor: 'var(--primary)', color: 'var(--secondary)' }}
                >
                  5
                </div>
                <h4 className="font-semibold mb-2" style={{ color: 'var(--primary)' }}>Instant Payment</h4>
                <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>STX tokens released immediately</p>
              </div>
            </div>
          </div>
        </section>

        {/* Call to Action */}
        {!isConnected && (
          <section className="text-center mb-20">
            <h2
              className="font-black mb-6"
              style={{
                fontSize: 'clamp(2rem, 5vw, 3rem)',
                color: 'var(--primary)'
              }}
            >
              READY TO GET STARTED?
            </h2>
            <p
              className="mb-8 max-w-2xl mx-auto"
              style={{
                fontSize: 'clamp(1.125rem, 2.5vw, 1.5rem)',
                color: 'var(--text-secondary)'
              }}
            >
              Connect your MetaMask wallet to Stacks Sepolia and start creating bounties or browsing opportunities
            </p>
          </section>
        )}

        {/* Footer */}
        <footer className="text-center pt-12 border-t border-gray-200">
          <p
            className="mb-4"
            style={{
              fontSize: 'clamp(0.875rem, 2vw, 1rem)',
              color: 'var(--text-secondary)'
            }}
          >
            TaskMint - Built with Next.js, ethers.js, and Stacks Network
          </p>
          <a
            href="https://explorer.hiro.so/address/ST2713NPQ8QG4PWM06WTXQ65YQB1DRY6ANXAT3VZQ.taskmint?chain=testnet"
            target="_blank"
            rel="noopener noreferrer"
            className="font-medium hover:underline transition-colors"
            style={{
              fontSize: 'clamp(0.875rem, 2vw, 1rem)',
              color: 'var(--accent)'
            }}
          >
            View Contract on Stacks Explorer →
          </a>
        </footer>
      </div>
    </div>
  );
}
