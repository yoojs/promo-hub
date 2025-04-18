'use client';

import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import { encodeInviteData } from '@/utils/encoding';

interface InviteButtonProps {
  eventId: string;
  promoterId: string;
}

export function InviteButton({ eventId, promoterId }: InviteButtonProps) {
  const handleCopyInviteLink = async () => {
    const encoded = encodeInviteData({
      eventId,
      promoterId
    });
    const inviteUrl = `${window.location.origin}/${encoded}`;
    
    try {
      await navigator.clipboard.writeText(inviteUrl);
      toast.success('Invitation link copied to clipboard!', {
        position: 'bottom-right',
      });
    } catch (err) {
      toast.error(`Failed to copy link: ${err instanceof Error ? err.message : 'Unknown error'}`,
        {
          position: 'bottom-right',
        }
      );
    }
  };

  return (
    <><button
          onClick={handleCopyInviteLink}
          className="mt-2 w-46 bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors"
      >
          Copy Invite Link
      </button><ToastContainer /></>
  );
}