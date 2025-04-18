'use client';

import { useState } from 'react';
import { AdditionalGuestModal } from '@/components/guests/additional-guest-modal';
import { addGuestsToEvent } from './actions';
import { AdditionalGuest } from '@/types/events';
interface InviteFormProps {
  eventId: string;
  promoterId: string;
  encodedCode: string;
}



const MAX_ADDITIONAL_GUESTS = 5;

export function InviteForm({ eventId, promoterId }: InviteFormProps) {
  const [formData, setFormData] = useState({
    full_name: '',
    phone: '',
    email: '',
    instagram: ''
  });
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [error, setError] = useState('');
  const [additionalGuests, setAdditionalGuests] = useState<AdditionalGuest[]>([]);
  const [isAddGuestModalOpen, setIsAddGuestModalOpen] = useState(false);

  const handleAddGuest = (guest: AdditionalGuest) => {
    setAdditionalGuests(prev => {
      if (prev.length >= MAX_ADDITIONAL_GUESTS) {
        return prev;
      }
      return [...prev, guest];
    });
  };

  const handleRemoveGuest = (index: number) => {
    setAdditionalGuests(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('loading');
    setError('');

    try {
        // add host_guest to all additional guests
        const host_guest = formData.full_name;
        const additionalGuestsWithHost = additionalGuests.map(guest => ({
            ...guest,
            host_guest
        }));
        //Combine all guests into one array
        const allGuests = [formData, ...additionalGuestsWithHost];
        const guestResult = await addGuestsToEvent({
            allGuests,
            eventId,
            promoterId
        });
      // First add the main guest
    //   const mainGuestResult = await addGuestToEvent({
    //     ...formData,
    //     eventId,
    //     promoterId
    //   });

      if (!guestResult.success) {
        throw new Error(guestResult.message);
      }
      setStatus('success');


    //   // Then add all additional guests
    //   const additionalGuestsResults = await Promise.all(
    //     additionalGuests.map(guest => 
    //       addGuestToEvent({
    //         ...guest,
    //         eventId,
    //         promoterId
    //       })
    //     )
    //   );

    //   const hasErrors = additionalGuestsResults.some(result => !result.success);
      
    //   if (hasErrors) {
    //     setStatus('error');
    //     setError('Some guests could not be added');
    //   } else {
    //     setStatus('success');
    //   }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (err) {
      setStatus('error');
      setError('An unexpected error occurred');
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
    <>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="full_name" className="block text-sm font-medium text-gray-300 mb-1">
            Full Name <span className="text-red-400">*</span>
          </label>
          <input
            type="text"
            id="full_name"
            required
            className="w-full px-3 py-2 bg-[#1e222a] border border-gray-700 rounded-md text-white"
            value={formData.full_name}
            onChange={e => setFormData(prev => ({ ...prev, full_name: e.target.value }))}
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

        {/* Additional Guests Section */}
        {additionalGuests.length > 0 && (
          <div className="mt-6">
            <h3 className="text-lg font-semibold text-white mb-3">Additional Guests</h3>
            <div className="space-y-3">
              {additionalGuests.map((guest, index) => (
                <div key={index} className="flex items-center justify-between bg-[#1e222a] p-3 rounded-lg">
                  <div>
                    <p className="text-white font-medium">{guest.full_name}</p>
                    {guest.phone && <p className="text-gray-400 text-sm">{guest.phone}</p>}
                  </div>
                  <button
                    type="button"
                    onClick={() => handleRemoveGuest(index)}
                    className="text-red-400 hover:text-red-300 transition-colors"
                  >
                    Remove
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="flex flex-col space-y-4">
          <button
            type="button"
            onClick={() => setIsAddGuestModalOpen(true)}
            disabled={additionalGuests.length >= MAX_ADDITIONAL_GUESTS}
            className="w-full px-4 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {additionalGuests.length >= MAX_ADDITIONAL_GUESTS 
              ? 'Maximum Guests Reached (5)'
              : `Add Additional Guest (${additionalGuests.length}/${MAX_ADDITIONAL_GUESTS})`
            }
          </button>

          <button
            type="submit"
            disabled={status === 'loading'}
            className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
          >
            {status === 'loading' ? 'Adding to Guest List...' : 'Join Guest List'}
          </button>
        </div>

        {error && (
          <p className="text-red-400 text-sm bg-red-400/10 p-2 rounded">{error}</p>
        )}
      </form>

      <AdditionalGuestModal
        isOpen={isAddGuestModalOpen}
        onClose={() => setIsAddGuestModalOpen(false)}
        onAdd={handleAddGuest}
      />
    </>
  );
}