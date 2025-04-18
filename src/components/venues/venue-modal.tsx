'use client';

import { useState, useEffect } from 'react';

interface Venue {
  id: string;
  name: string;
  description: string | null;
  created_at: string;
  updated_at: string;
}

interface VenueModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (venueData: Omit<Venue, 'id' | 'created_at' | 'updated_at'>) => Promise<void>;
  venue: Venue | null;
  loading: boolean;
}

export function VenueModal({ isOpen, onClose, onSave, venue, loading }: VenueModalProps) {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');

  useEffect(() => {
    if (venue) {
      setName(venue.name);
      setDescription(venue.description || '');
    } else {
      setName('');
      setDescription('');
    }
  }, [venue]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSave({ name, description: description || null });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-[#262b36] rounded-xl p-6 w-full max-w-md">
        <h2 className="text-2xl font-bold text-white mb-4">
          {venue ? 'Edit Venue' : 'Add Venue'}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-300 mb-1">
              Name
            </label>
            <input
              type="text"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-4 py-2 rounded-lg bg-[#1e222a]/90 border border-white/10 text-white placeholder-gray-400 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
              required
            />
          </div>

          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-300 mb-1">
              Description
            </label>
            <textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={4}
              className="w-full px-4 py-2 rounded-lg bg-[#1e222a]/90 border border-white/10 text-white placeholder-gray-400 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
            />
          </div>

          <div className="flex justify-end space-x-4 mt-6">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-300 hover:text-white transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
            >
              {loading ? 'Saving...' : 'Save'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
} 