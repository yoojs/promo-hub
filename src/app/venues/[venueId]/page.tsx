'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import { NavigationWrapper } from '@/components/navigation-wrapper';
import { getVenueById } from '../actions';
import { Venue } from '@/types/venues';
import { Event } from '@/types/events';
import { useProfile } from '@/hooks/use-profile';
import Link from 'next/link';
import { format } from 'date-fns';
import { use } from 'react';
export default function VenueDetailPage({ params }: { params: Promise<{ venueId: string }> }) {
    const { venueId } = use(params);
    
  const [venue, setVenue] = useState<Venue | null>(null);
  const [upcomingEvents, setUpcomingEvents] = useState<Event[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { data: profile } = useProfile();

  useEffect(() => {
    async function fetchVenueData() {
      try {
        const data = await getVenueById(venueId);
        setVenue(data);
        // Assuming events are included in the venue data
        if (data?.events) {
          const now = new Date();
          const upcoming: Event[] = data.events
            .filter((event: Event) => new Date(event.date) >= now)
            .sort((a: Event, b: Event) => new Date(a.date).getTime() - new Date(b.date).getTime());
          setUpcomingEvents(upcoming);
        }
      } catch (error) {
        console.error('Error fetching venue:', error);
      } finally {
        setIsLoading(false);
      }
    }

    fetchVenueData();
  }, [venueId]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#1a1d24]">
        <NavigationWrapper />
        <div className="flex items-center justify-center min-h-screen">
          <p className="text-gray-400 text-lg">Loading venue details...</p>
        </div>
      </div>
    );
  }

  if (!venue) {
    return (
      <div className="min-h-screen bg-[#1a1d24]">
        <NavigationWrapper />
        <div className="flex items-center justify-center min-h-screen">
          <p className="text-red-400 text-lg">Venue not found</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#1a1d24]">
      <NavigationWrapper />
      
      <div className="relative z-10 py-8 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="bg-[#2a2d35] rounded-lg shadow-xl p-8">
            <div className="relative w-full h-48 mb-6 rounded-lg overflow-hidden">
                {venue.image_url ? (
                <Image
                    src={venue.image_url}
                    alt={venue.name || 'Venue'}
                    fill
                    className="object-cover"
                />
                ) : (
                <div className="w-full h-full bg-blue-600 flex items-center justify-center">
                    <span className="text-white text-xl font-bold">
                    {venue.name?.charAt(0) || '?'}
                    </span>
                </div>
                )}
            </div>
            <div className="flex md:flex-row flex-col justify-between items-start mb-6">
                
              <div>
                <h1 className="text-3xl font-bold text-white mb-2">{venue.name}</h1>
                {venue.address && (
                  <p className="text-gray-400 text-lg">{venue.address}</p>
                )}
              </div>
              
              {profile?.role === 'admin' && (
                <Link
                  href={`/venues/${venueId}/edit`}
                  className="mt-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Edit Venue
                </Link>
              )}
            </div>

            {venue.description && (
              <div className="mb-8 prose prose-invert max-w-none">
                <p className="text-gray-300">{venue.description}</p>
              </div>
            )}

            <div className="mt-12">
              <h2 className="text-2xl font-semibold text-white mb-6">Upcoming Events</h2>
              {upcomingEvents.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {upcomingEvents.map((event) => (
                    <Link
                      key={event.id}
                      href={`/events/${event.id}`}
                      className="block group"
                    >
                      <div className="bg-[#1a1d24] rounded-lg p-6 hover:bg-[#1e2128] transition-colors">
                        <div className="relative w-full h-48 mb-2 rounded-lg overflow-hidden">
                            {event.image_url ? (
                                <Image
                                src={event.image_url}
                                alt={event.name || 'Event'}
                                fill
                                className="object-cover"
                                />
                            ) : (
                                <div className="w-full h-full bg-blue-600 flex items-center justify-center">
                                <span className="text-white text-xl font-bold">
                                    {event.name?.charAt(0) || '?'}
                                </span>
                                </div>
                            )}
                        </div>
                        <h3 className="text-xl font-semibold text-white mb-2 group-hover:text-blue-400">
                          {event.name}
                        </h3>
                        <p className="text-gray-400">
                          {format(new Date(event.date), 'EEEE, MMMM d, yyyy')}
                        </p>
                        <p className="text-gray-400">
                          {event.start_time} - {event.end_time}
                        </p>
                      </div>
                    </Link>
                  ))}
                </div>
              ) : (
                <p className="text-gray-400 text-center py-8">
                  No upcoming events scheduled
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}