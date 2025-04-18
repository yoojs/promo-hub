'use client';

import { useState } from 'react';
import { addGuestToEvent } from './actions';

interface InviteFormProps {
  eventId: string;
  promoterId: string;
  encodedCode: string;
}

export function InviteForm({ eventId, promoterId }: InviteFormProps) {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    instagram: ''
  });
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('loading');
    setError('');

    try {
      const result = await addGuestToEvent({
        ...formData,
        eventId,
        promoterId
      });

      if (result.success) {
        setStatus('success');
      } else {
        setStatus('error');
        setError(result.message ?? 'An error occurred');
      }
    } catch (err) {
      setStatus('error');
      setError(err instanceof Error ? err.message : 'An unexpected error occurred');
    }
  };

  if (status === 'success') {
    return (
      <div className="text-center">
        <h2 className="text-2xl font-bold text-green-400 mb-2">You&apos;re on the list!</h2>
        <p className="text-gray-300">We look forward to seeing you!</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="name" className="block text-sm font-medium text-gray-300 mb-1">
          Full Name <span className="text-red-400">*</span>
        </label>
        <input
          type="text"
          id="name"
          required
          className="w-full px-3 py-2 bg-[#1e222a] border border-gray-700 rounded-md text-white"
          value={formData.name}
          onChange={e => setFormData(prev => ({ ...prev, name: e.target.value }))}
        />
      </div>

      <div>
        <label htmlFor="phone" className="block text-sm font-medium text-gray-300 mb-1">
          Phone Number <span className="text-red-400">*</span>
        </label>
        <input
          type="tel"
          id="phone"
          required
          className="w-full px-3 py-2 bg-[#1e222a] border border-gray-700 rounded-md text-white"
          value={formData.phone}
          onChange={e => setFormData(prev => ({ ...prev, phone: e.target.value }))}
        />
      </div>

      <div>
        <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-1">
          Email (Optional)
        </label>
        <input
          type="email"
          id="email"
          className="w-full px-3 py-2 bg-[#1e222a] border border-gray-700 rounded-md text-white"
          value={formData.email}
          onChange={e => setFormData(prev => ({ ...prev, email: e.target.value }))}
        />
      </div>

      <div>
        <label htmlFor="instagram" className="block text-sm font-medium text-gray-300 mb-1">
          Instagram (Optional)
        </label>
        <input
          type="text"
          id="instagram"
          className="w-full px-3 py-2 bg-[#1e222a] border border-gray-700 rounded-md text-white"
          value={formData.instagram}
          onChange={e => setFormData(prev => ({ ...prev, instagram: e.target.value }))}
        />
      </div>

      {error && (
        <p className="text-red-400 text-sm bg-red-400/10 p-2 rounded">{error}</p>
      )}

      <button
        type="submit"
        disabled={status === 'loading'}
        className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
      >
        {status === 'loading' ? 'Submitting...' : 'Join Guest List'}
      </button>
    </form>
  );
}