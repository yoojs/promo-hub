'use client';

import { useState } from 'react';
import { GuestModal } from './guest-modal';
import { toast } from 'react-hot-toast';
import { checkInGuest } from '@/app/guestlists/[eventId]/actions';
interface Guest {
  id: string;
  full_name: string;
  email: string;
  phone: string;
  checked_in: boolean;
  check_in_time: string | null;
  added_at: string;
}

interface GuestListProps {
  eventId: string;
  initialGuests: Guest[];
}

export function GuestList({ eventId, initialGuests }: GuestListProps) {
  const [guests, setGuests] = useState<Guest[]>(initialGuests);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleCheckIn = async (guestId: string) => {
    setIsLoading(true);
    try {
      await checkInGuest(eventId, guestId);
      // Update local state
      setGuests(prevGuests =>
        prevGuests.map(guest =>
          guest.id === guestId
            ? { ...guest, checked_in: !guest.checked_in, check_in_time: guest.checked_in ? null : new Date().toISOString() }
            : guest
        )
      );
    } catch (error) {
      console.error('Error checking in guest:', error);
      toast.error('Failed to check in guest');
    } finally {
      setIsLoading(false);
    }
  };


  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-white">Guest List</h2>
        <button
          onClick={() => setIsModalOpen(true)}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          Add Guest
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {guests.map((guest) => (
          <button 
            key={`guest-${guest.id}`} 
            onClick={() => handleCheckIn(guest.id)}
            disabled={isLoading}
            className={`w-full text-left bg-[#2a2d35] rounded-lg p-6 shadow-lg hover:shadow-xl transition-all ${
              guest.checked_in 
                ? 'hover:bg-red-500/10' 
                : 'hover:bg-green-500/10'
            } disabled:opacity-50 disabled:cursor-not-allowed`}
          >
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="text-lg font-semibold text-white mb-2">{guest.full_name}</h3>
                <div className="space-y-1">
                  <div className="flex items-center text-sm">
                    <svg className="w-4 h-4 text-gray-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                    <span className="text-gray-400">{guest.email}</span>
                  </div>
                  <div className="flex items-center text-sm">
                    <svg className="w-4 h-4 text-gray-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                    <span className="text-gray-400">{guest.phone}</span>
                  </div>
                  <div className="flex items-center text-sm">
                    <svg className="w-4 h-4 text-gray-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span className="text-gray-400">Added: {new Date(guest.added_at).toLocaleDateString()}</span>
                  </div>
                </div>
              </div>
              <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                guest.checked_in 
                  ? 'bg-green-500/20 text-green-400' 
                  : 'bg-yellow-500/20 text-yellow-400'
              }`}>
                {guest.checked_in ? 'Checked In' : 'Pending'}
              </span>
            </div>

            <div className="flex items-center text-sm bg-[#1a1d24] p-3 rounded-lg">
              <svg className="w-4 h-4 text-gray-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
              <div>
                <span className="text-gray-400">Check-in Time:</span>
                <span className="text-white ml-2">
                  {guest.check_in_time ? new Date(guest.check_in_time).toLocaleString() : 'Not checked in'}
                </span>
              </div>
            </div>
          </button>
        ))}
      </div>

      <GuestModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        eventId={eventId}
        onSuccess={(newGuest) => {
          setGuests(prev => [...prev, newGuest])
          setIsModalOpen(false)
        }}
      />
    </div>
  )
} 