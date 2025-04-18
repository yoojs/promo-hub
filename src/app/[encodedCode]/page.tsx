import { notFound } from 'next/navigation';
import { createClient } from '@/utils/supabase/server';
import { decodeInviteData } from '@/utils/encoding';
import { format } from 'date-fns';
import { InviteForm } from './invite-form';
import Image from 'next/image';


export default async function InvitePage({ params }: { params: Promise<{ encodedCode: string }> }) {
    const {encodedCode} = await params;
  const inviteData = decodeInviteData(encodedCode);
  if (!inviteData) return notFound();

  const supabase = await createClient();
  
  // Fetch event details
  const { data: event } = await supabase
    .from('events')
    .select('*')
    .eq('id', inviteData.eventId)
    .single();
  // Fetch promoter details
  const { data: profile } = await supabase
    .from('profiles')
    .select('full_name')
    .eq('id', inviteData.promoterId)
    .single();
  if (!event || !profile) return notFound();

  // Check if event has passed
  const eventDate = new Date(`${event.date}T${event.start_time}`);
  if (new Date() > eventDate) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-[#1a1d24] to-[#2a2d35] flex items-center justify-center p-4">
        <div className="bg-[#2a2d35] rounded-lg shadow-xl p-8 max-w-md w-full text-center">
          <h1 className="text-2xl font-bold text-red-400 mb-4">Event Has Ended</h1>
          <p className="text-gray-300">This event has already started or ended.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#1a1d24] to-[#2a2d35] flex items-center justify-center p-4">
      <div className="bg-[#2a2d35] rounded-lg shadow-xl p-8 max-w-md w-full">
        <div className="relative w-full h-48 mb-4 rounded-lg overflow-hidden">
            {event.image_url ? (
                <Image
                    src={event.image_url}
                    alt={event.name || 'Event'}
                    className="object-cover w-full h-full"
                />
            ) : (
                <div className="w-full h-full bg-blue-600 flex items-center justify-center">
                    <span className="text-white text-xl font-bold">
                        {event.name?.charAt(0) || '?'}
                    </span>
                </div>
            )}
        </div>
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">{event.name}</h1>
          <p className="text-gray-300 text-lg mb-1">
            {format(eventDate, 'EEEE, MMMM d, yyyy')}
          </p>
          <p className="text-gray-400">
            {event.start_time} - {event.end_time}
          </p>
          {event.venue && (
            <p className="text-gray-400 mt-2">
              at {event.venue.name}
              {event.venue.location && ` • ${event.venue.location}`}
            </p>
          )}
          <div className="mt-4 text-sm text-gray-400">
            Invited by: {profile.full_name}
          </div>
        </div>

        <InviteForm 
          eventId={event.id} 
          promoterId={profile.full_name}
          encodedCode={encodedCode}
        />
      </div>
    </div>
  );
}