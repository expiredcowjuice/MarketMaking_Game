'use client';

import { useState } from 'react';

interface SetupScreenProps {
  onStart: (marketQuestion: string, participants: string[]) => void;
  previousParticipants?: string[];
}

export default function SetupScreen({ onStart, previousParticipants = [] }: SetupScreenProps) {
  const [marketQuestion, setMarketQuestion] = useState('');
  const [participants, setParticipants] = useState<string[]>(previousParticipants);
  const [newName, setNewName] = useState('');
  const [error, setError] = useState('');

  const addParticipant = () => {
    const name = newName.trim();
    if (!name) return;
    if (participants.includes(name)) {
      setError('Name already exists');
      return;
    }
    setParticipants([...participants, name]);
    setNewName('');
    setError('');
  };

  const removeParticipant = (name: string) => {
    setParticipants(participants.filter(p => p !== name));
  };

  const handleStart = () => {
    if (!marketQuestion.trim()) {
      setError('Please enter a market question');
      return;
    }
    if (participants.length < 2) {
      setError('Need at least 2 participants');
      return;
    }
    onStart(marketQuestion.trim(), participants);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      addParticipant();
    }
  };

  return (
    <div className="min-h-screen bg-vc-dark flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl p-10 w-full max-w-lg vc-card relative overflow-hidden">
        {/* Yellow accent bar at top */}
        <div className="absolute top-0 left-0 right-0 h-1.5 bg-vc-yellow" />

        <div className="mb-8">
          <h1 className="text-3xl font-bold text-vc-dark mb-2 tracking-tight">
            <span className="vc-highlight">Market Making</span> Game
          </h1>
          <p className="text-gray-500 text-sm">Learn to make markets by trading with friends</p>
        </div>

        <div className="mb-8">
          <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">
            Market Question
          </label>
          <input
            type="text"
            value={marketQuestion}
            onChange={e => setMarketQuestion(e.target.value)}
            placeholder="e.g. Total runtime of Lord of the Rings trilogy in minutes?"
            className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-vc-yellow focus:border-transparent bg-gray-50/50 placeholder:text-gray-400 transition-shadow"
          />
        </div>

        <div className="mb-8">
          <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">
            Participants
          </label>
          <div className="flex gap-2 mb-3">
            <input
              type="text"
              value={newName}
              onChange={e => setNewName(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Enter name"
              className="flex-1 px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-vc-yellow focus:border-transparent bg-gray-50/50 placeholder:text-gray-400 transition-shadow"
            />
            <button
              onClick={addParticipant}
              className="px-5 py-3 bg-vc-dark text-white rounded-xl text-sm font-semibold hover:bg-black transition-colors vc-btn"
            >
              Add
            </button>
          </div>

          {participants.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-3">
              {participants.map(name => (
                <span
                  key={name}
                  className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-vc-yellow/15 text-vc-dark rounded-full text-sm font-semibold border border-vc-yellow/20"
                >
                  {name}
                  <button
                    onClick={() => removeParticipant(name)}
                    className="ml-0.5 text-vc-dark/30 hover:text-vc-pink transition-colors font-bold text-base leading-none"
                  >
                    &times;
                  </button>
                </span>
              ))}
            </div>
          )}

          <p className="text-xs text-gray-400 mt-3">
            {participants.length} participant{participants.length !== 1 ? 's' : ''} added
            {participants.length < 2 ? ' (need at least 2)' : ''}
          </p>
        </div>

        {error && (
          <p className="text-vc-pink text-sm mb-4 font-medium">{error}</p>
        )}

        <button
          onClick={handleStart}
          disabled={participants.length < 2 || !marketQuestion.trim()}
          className="w-full py-3.5 bg-vc-yellow text-vc-dark rounded-xl font-bold text-base hover:brightness-110 disabled:bg-gray-200 disabled:text-gray-400 disabled:cursor-not-allowed transition-all vc-btn tracking-tight"
        >
          Start Game
        </button>
      </div>
    </div>
  );
}
