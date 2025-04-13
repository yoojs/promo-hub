import { Suspense } from 'react';
import { use } from 'react';
import { Navigation } from '@/components/navigation';
import { GuestList } from '@/components/guests/guest-list-client';
import { getEvent } from './actions';

export default function GuestListPage({ params }: { params: Promise<{ eventId: string }> }) {
  const { eventId } = use(params);
  const event = use(getEvent(eventId));

  if (!event) {
    return (
      <div className="min-h-screen bg-[#1a1d24]">
        <Navigation />
        <div className="relative z-10 py-8 px-4">
          <div className="max-w-7xl mx-auto">
            <div className="text-center py-12">
              <p className="text-gray-400 text-lg">Event not found</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#1a1d24]">
      <Navigation />
      
      {/* Content */}
      <div className="relative z-10 py-8 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-white mb-2">{event.name}</h1>
            <p className="text-gray-400">
              {new Date(event.date).toLocaleDateString()} at {event.start_time}
              {event.location && ` • ${event.location}`}
            </p>
          </div>

          <Suspense fallback={<div className="text-center py-12"><p className="text-gray-400 text-lg">Loading guests...</p></div>}>
            <GuestList 
              eventId={eventId} 
              initialGuests={Object.values(event?.guests || {})} 
            />
          </Suspense>
        </div>
      </div>
    </div>
  );
} 