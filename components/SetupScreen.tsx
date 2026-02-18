'use client';

import { useState } from 'react';

interface SetupScreenProps {
  onStart: (marketQuestion: string, participants: string[]) => void;
}

export default function SetupScreen({ onStart }: SetupScreenProps) {
  const [marketQuestion, setMarketQuestion] = useState('');
  const [participants, setParticipants] = useState<string[]>([]);
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
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-lg p-8 w-full max-w-lg">
        <h1 className="text-2xl font-bold text-gray-900 mb-1">Market Making Game</h1>
        <p className="text-gray-500 text-sm mb-6">Learn to make markets by trading with friends</p>

        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Market Question
          </label>
          <input
            type="text"
            value={marketQuestion}
            onChange={e => setMarketQuestion(e.target.value)}
            placeholder="e.g. Total runtime of Lord of the Rings trilogy in minutes?"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Participants
          </label>
          <div className="flex gap-2 mb-2">
            <input
              type="text"
              value={newName}
              onChange={e => setNewName(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Enter name"
              className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <button
              onClick={addParticipant}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
            >
              Add
            </button>
          </div>

          {participants.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-3">
              {participants.map(name => (
                <span
                  key={name}
                  className="inline-flex items-center gap-1 px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-sm"
                >
                  {name}
                  <button
                    onClick={() => removeParticipant(name)}
                    className="ml-1 text-blue-400 hover:text-blue-700 font-bold"
                  >
                    &times;
                  </button>
                </span>
              ))}
            </div>
          )}

          <p className="text-xs text-gray-400 mt-2">
            {participants.length} participant{participants.length !== 1 ? 's' : ''} added
            {participants.length < 2 ? ' (need at least 2)' : ''}
          </p>
        </div>

        {error && (
          <p className="text-red-600 text-sm mb-4">{error}</p>
        )}

        <button
          onClick={handleStart}
          disabled={participants.length < 2 || !marketQuestion.trim()}
          className="w-full py-3 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
        >
          Start Game
        </button>
      </div>
    </div>
  );
}
