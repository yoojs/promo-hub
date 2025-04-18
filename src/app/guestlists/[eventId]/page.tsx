import { Suspense } from 'react';
import { use } from 'react';
import { NavigationWrapper } from '@/components/navigation-wrapper';
import { GuestList } from '@/components/guests/guest-list-client';
import { getEvent, getVenue } from './actions';
import { getProfile } from '@/app/account/actions';
import { InviteButton } from '@/components/events/invite-button';

export default function GuestListPage({ params }: { params: Promise<{ eventId: string }> }) {
  const { eventId } = use(params);
  const event = use(getEvent(eventId));
  const profileData = use(getProfile());
  if (!event) {
    return (
      <div className="min-h-screen bg-[#1a1d24]">
        <NavigationWrapper />
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
  const venue = use(getVenue(event.venue_id));

  return (
    <div className="min-h-screen bg-[#1a1d24]">
      <NavigationWrapper />
      
      {/* Content */}
      <div className="relative z-10 py-8 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-white mb-2">{event.name}</h1>
            <h2 className="text-xl font-bold text-white mb-2">
              {venue?.name || 'Unknown Venue'}
              {venue.address && ` • ${venue.address}`}
            </h2>
            <p className="text-gray-400">
              {new Date(event.date).toLocaleDateString()} at {event.start_time}
            </p>
            {(profileData?.role === 'promoter' || profileData?.role === 'admin') && (
              <InviteButton 
                eventId={event.id}
                promoterId={profileData.id}
              />
            )}
          </div>

          {/* Search Bar */}
          <div className="max-w-xl mx-auto mb-8">
            <div className="relative">
              <input
                type="text"
                placeholder="Search guests by name, email, phone..."
                className="w-full px-4 py-2 bg-[#262b36] text-white rounded-lg border border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                id="guest-search"
              />
              <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                <svg
                  className="h-5 w-5 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
              </div>
            </div>
          </div>

          <Suspense fallback={<div className="text-center py-12"><p className="text-gray-400 text-lg">Loading guests...</p></div>}>
            <GuestList 
              eventId={eventId} 
              initialGuests={Object.values(event?.guests || {})} 
              searchInputId="guest-search"
            />
          </Suspense>
        </div>
      </div>
    </div>
  );
}