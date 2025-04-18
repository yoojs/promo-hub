'use client';

import { useState, useEffect } from 'react';
import { Dialog } from '@headlessui/react';
import { toast } from 'react-hot-toast';
import { Guest } from './guest-list-client';
import { getProfile } from '@/app/account/actions';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { useProfile } from '@/hooks/use-profile';

interface GuestModalProps {
  isOpen: boolean;
  onClose: () => void;
  eventId: string;
  guest?: Guest | null;
  onSuccess: (guest: Guest) => void;
}

interface FormData {
  full_name: string;
  email: string;
  phone: string;
  instagram: string;
  note: string;
}

export function GuestModal({ isOpen, onClose, eventId, guest, onSuccess }: GuestModalProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState<FormData>({
    full_name: guest?.full_name || '',
    email: guest?.email || '',
    phone: guest?.phone || '',
    instagram: guest?.instagram || '',
    note: guest?.note || '',
  });
  const { data: profile } = useProfile();
  const isAdminOrPromoter = profile?.role === 'admin' || profile?.role === 'promoter';
  const isRejected = guest?.rejected === true; // Check if the guest is currently rejected

  useEffect(() => {
    setFormData({
      full_name: guest?.full_name || '',
      email: guest?.email || '',
      phone: guest?.phone || '',
      instagram: guest?.instagram || '',
      note: guest?.note || '',
    });
  }, [guest, isOpen]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { id, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [id]: value
    }));
  };

  // Renamed function to handle both reject and unreject
  const handleRejectToggle = async () => {
    // Note is required only when rejecting, not unrejecting
    if (!isRejected && !formData.note) {
      toast.error('Note is required to reject a guest');
      return;
    }

    setIsLoading(true);

    try {
      const supabase = createClientComponentClient();
      const { data: eventData, error: eventError } = await supabase
        .from('events')
        .select('guests')
        .eq('id', eventId)
        .single();

      if (eventError) throw eventError;
      if (!guest?.id) throw new Error('Guest ID is required');

      let updatedGuestData: Partial<Guest>;
      let successMessage: string;

      if (isRejected) {
        // Unrejecting the guest
        updatedGuestData = {
          ...guest,
          note: formData.note, // Keep the note or update if changed
          rejected: false,
        };
        successMessage = 'Guest unrejected successfully!';
      } else {
        // Rejecting the guest
        updatedGuestData = {
          ...guest,
          note: formData.note,
          checked_in: false, // Ensure checked_in is false when rejecting
          check_in_time: null,
          rejected: true
        };
        successMessage = 'Guest rejected successfully!';
      }

      // Update guest in Supabase
      const { error } = await supabase
        .from('events')
        .update({
          guests: {
            ...eventData?.guests,
            [guest.id]: updatedGuestData,
          }
        })
        .eq('id', eventId);

      if (error) {
        throw error;
      }

      // Call onSuccess with the full updated guest object
      onSuccess(updatedGuestData as Guest);
      toast.success(successMessage);
      onClose();
    } catch (error) {
      console.error(`Error ${isRejected ? 'unrejecting' : 'rejecting'} guest:`, error);
      toast.error(`Failed to ${isRejected ? 'unreject' : 'reject'} guest: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const supabase = createClientComponentClient();
      const { data: eventData, error: eventError } = await supabase
        .from('events')
        .select('guests')
        .eq('id', eventId)
        .single();

      if (eventError) throw eventError;
      const userProfile = await getProfile();
      if (!userProfile) throw new Error('User profile not found');

      if (guest) {
        // Update existing guest - preserve rejection status unless explicitly changed by handleRejectToggle
        const updatedGuestData = {
          ...guest,
          full_name: formData.full_name,
          email: formData.email,
          phone: formData.phone,
          instagram: formData.instagram,
          note: formData.note,
          // Keep existing rejection status on normal save
          rejected: guest.rejected,
        };

        const { error } = await supabase
          .from('events')
          .update({
            guests: {
              ...eventData?.guests,
              [guest.id]: updatedGuestData,
            }
          })
          .eq('id', eventId);

        if (error) throw error;

        onSuccess(updatedGuestData);
        toast.success('Guest updated successfully!');
      } else {
        // Create new guest
        const guestId = crypto.randomUUID();
        const newGuest: Guest = {
          id: guestId,
          full_name: formData.full_name,
          email: formData.email,
          phone: formData.phone,
          instagram: formData.instagram,
          note: formData.note,
          checked_in: false,
          check_in_time: null,
          added_at: new Date().toISOString(),
          added_by: userProfile.full_name || userProfile.id,
          rejected: false,
        };

        const { error } = await supabase
          .from('events')
          .update({
            guests: {
              ...eventData?.guests,
              [guestId]: newGuest
            }
          })
          .eq('id', eventId);

        if (error) throw error;

        onSuccess(newGuest);
        toast.success('Guest added successfully!');
      }
      onClose();
    } catch (error) {
      console.error('Error adding/updating guest:', error);
      toast.error(`Failed to save guest: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onClose={onClose} className="relative z-50">
      <div className="fixed inset-0 bg-black/50" aria-hidden="true" />

      <div className="fixed inset-0 flex items-center justify-center p-4">
        <Dialog.Panel className="bg-[#262b36] rounded-lg p-6 w-full max-w-md">
          <Dialog.Title className="text-2xl font-bold text-white mb-4">
            {guest ? 'Edit Guest' : 'Add Guest'}
          </Dialog.Title>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* ... form fields remain the same ... */}
             <div>
              <label htmlFor="full_name" className="block text-sm font-medium text-gray-300 mb-1">
                Full Name
              </label>
              <input
                type="text"
                id="full_name"
                className="w-full px-3 py-2 bg-[#1e222a] border border-gray-700 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
                value={formData.full_name}
                onChange={handleChange}
                required
                disabled={!isAdminOrPromoter}
              />
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-1">
                Email
              </label>
              <input
                type="email"
                id="email"
                className="w-full px-3 py-2 bg-[#1e222a] border border-gray-700 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
                value={formData.email}
                onChange={handleChange}
                disabled={!isAdminOrPromoter}
              />
            </div>

            <div>
              <label htmlFor="phone" className="block text-sm font-medium text-gray-300 mb-1">
                Phone
              </label>
              <input
                type="tel"
                id="phone"
                className="w-full px-3 py-2 bg-[#1e222a] border border-gray-700 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
                value={formData.phone}
                onChange={handleChange}
                disabled={!isAdminOrPromoter}
              />
            </div>

            <div>
              <label htmlFor="instagram" className="block text-sm font-medium text-gray-300 mb-1">
                Instagram
              </label>
              <input
                type="text"
                id="instagram"
                className="w-full px-3 py-2 bg-[#1e222a] border border-gray-700 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
                value={formData.instagram}
                onChange={handleChange}
                disabled={!isAdminOrPromoter}
              />
            </div>

            <div>
              <label htmlFor="note" className="block text-sm font-medium text-gray-300 mb-1">
                Note {guest && !isRejected && <span className="text-red-400 text-xs">(Required for Reject)</span>}
              </label>
              <textarea
                id="note"
                rows={3}
                className="w-full px-3 py-2 bg-[#1e222a] border border-gray-700 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={formData.note}
                onChange={handleChange}
              />
            </div>

            <div className="flex justify-end space-x-4 pt-2">
              <button
                type="button"
                className="px-4 py-2 text-gray-300 rounded-md hover:bg-gray-700 transition-colors"
                onClick={onClose}
              >
                Cancel
              </button>
              {/* Reject/Unreject button */}
              {guest && (
                <button
                  type="button"
                  disabled={isLoading}
                  // Change button style and text based on rejection status
                  className={`px-6 py-2 text-white rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${
                    isRejected
                      ? 'bg-yellow-600 hover:bg-yellow-700' // Style for Unreject
                      : 'bg-red-600 hover:bg-red-700' // Style for Reject
                  }`}
                  onClick={handleRejectToggle} // Use the new handler
                >
                  {isLoading ? 'Processing...' : (isRejected ? 'Unreject' : 'Reject')}
                </button>
              )}
              {/* Save button */}
              {isAdminOrPromoter && (
                <button
                  type="submit"
                  disabled={isLoading}
                  className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading ? 'Saving...' : 'Save'}
                </button>
              )}
            </div>
          </form>
        </Dialog.Panel>
      </div>
    </Dialog>
  );
}