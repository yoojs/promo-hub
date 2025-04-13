'use client';

import { useState } from 'react';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { toast } from 'react-hot-toast';

interface Guest {
  id: string;
  full_name: string;
  email: string;
  phone: string;
  checked_in: boolean;
  check_in_time: string | null;
  added_at: string;
}

interface GuestModalProps {
  isOpen: boolean;
  onClose: () => void;
  eventId: string;
  onSuccess: (guest: Guest) => void;
}

interface FormData {
  full_name: string;
  email: string;
  phone: string;
  checked_in: boolean;
  check_in_time: string | null;
}

export function GuestModal({ isOpen, onClose, eventId, onSuccess }: GuestModalProps) {
  const [formData, setFormData] = useState<FormData>({
    full_name: '',
    email: '',
    phone: '',
    checked_in: false,
    check_in_time: null
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const supabase = createClientComponentClient();
      
      // Get current event data
      const { data: eventData, error: eventError } = await supabase
        .from('events')
        .select('guests')
        .eq('id', eventId)
        .single();

      if (eventError) throw eventError;

      // Create new guest
      const newGuest: Guest = {
        id: crypto.randomUUID(),
        ...formData,
        added_at: new Date().toISOString()
      };

      // Update the event's guests
      const updatedGuests = {
        ...eventData.guests,
        [newGuest.id]: newGuest
      };

      // Update the event
      const { error: updateError } = await supabase
        .from('events')
        .update({ guests: updatedGuests })
        .eq('id', eventId);

      if (updateError) throw updateError;

      onSuccess(newGuest);
    } catch (error) {
      console.error('Error adding guest:', error);
      toast.error('Failed to add guest');
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-[#2a2d35] rounded-lg p-6 w-full max-w-md">
        <h2 className="text-2xl font-bold text-white mb-4">Add Guest</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="full_name" className="block text-sm font-medium text-gray-400 mb-1">
              Full Name
            </label>
            <input
              type="text"
              id="full_name"
              value={formData.full_name}
              onChange={(e) => setFormData(prev => ({ ...prev, full_name: e.target.value }))}
              className="w-full px-3 py-2 bg-[#1a1d24] border border-gray-700 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-400 mb-1">
              Email
            </label>
            <input
              type="email"
              id="email"
              value={formData.email}
              onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
              className="w-full px-3 py-2 bg-[#1a1d24] border border-gray-700 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          <div>
            <label htmlFor="phone" className="block text-sm font-medium text-gray-400 mb-1">
              Phone
            </label>
            <input
              type="tel"
              id="phone"
              value={formData.phone}
              onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
              className="w-full px-3 py-2 bg-[#1a1d24] border border-gray-700 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id="checked_in"
              checked={formData.checked_in}
              onChange={(e) => setFormData(prev => ({ 
                ...prev, 
                checked_in: e.target.checked,
                check_in_time: e.target.checked ? new Date().toISOString() : null
              }))}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-700 rounded"
            />
            <label htmlFor="checked_in" className="text-sm font-medium text-gray-400">
              Check in now
            </label>
          </div>
          <div className="flex justify-end space-x-3 mt-6">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-400 hover:text-white transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50"
            >
              {isLoading ? 'Adding...' : 'Add Guest'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
} 