'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@/utils/supabase/client';
import { NavigationWrapper } from '@/components/navigation-wrapper';
import { Event } from '@/types/events';
import Link from 'next/link';

type Venue = {
  id: string;
  name: string;
  location: string;
  events: Event[];
};


type VenueWithEvents = Venue & {
  events: Event[];
};

export default function GuestlistsPage() {
  const [venuesWithEvents, setVenuesWithEvents] = useState<VenueWithEvents[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchVenuesAndEvents = async () => {
    setLoading(true);
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      setLoading(false);
      console.log("User not logged in");
      setVenuesWithEvents([]);
      return;
    }

    const { data: profileData } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single();

    const { data: venuesData, error: venuesError } = await supabase
      .from('venues')
      .select(`
        id,
        name,
        events (
          id,
          created_at,
          venue_id,
          name,
          date,
          start_time,
          end_time,
          promoters
        )
      `)
      .returns<VenueWithEvents[]>()
      .order('name', { ascending: true });
    // Check if there was an error fetching venues

    if (venuesError) {
      console.error('Error fetching venues:', venuesError);
      setLoading(false);
      setVenuesWithEvents([]);
      return;
    }

    let processedVenues: VenueWithEvents[] = venuesData || [];

    if (profileData?.role !== 'admin') {
      processedVenues = processedVenues.map(venue => {
        const filteredEvents = venue.events.filter(event => {
          return event.promoters.includes(user.id);
        });
        return { ...venue, events: filteredEvents };
      }).filter(venue => venue.events.length > 0);
    }

    processedVenues.forEach(venue => {
      venue.events.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    });

    setVenuesWithEvents(processedVenues);
    setLoading(false);
  };

  useEffect(() => {
    fetchVenuesAndEvents();
  }, []);

  return (
    <div className="min-h-screen bg-[#1a1d24]">
      <NavigationWrapper />

      {/* Content */}
      <div className="relative z-10 py-8 px-4">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-4xl font-bold text-white mb-8 text-center">Guest Lists by Venue</h1>

          {loading ? (
            <div className="text-center py-12">
              <p className="text-gray-400 text-lg">Loading venues and events...</p>
            </div>
          ) : venuesWithEvents.length > 0 ? (
            // Loop through venues
            venuesWithEvents.map((venue) => (
              <div key={venue.id} className="mb-12"> {/* Section for each venue */}
                <h2 className="text-2xl font-semibold text-white mb-6 border-b border-gray-700 pb-2">
                  {venue.name} {venue.location ? <span className="text-lg text-gray-400">({venue.location})</span> : ''}
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {/* Loop through events within the venue */}
                  {venue.events.map((event) => (
                    // Event Card
                    <div key={event.id} className="bg-[#262b36]/80 backdrop-blur-sm rounded-xl p-6 shadow-xl flex flex-col justify-between h-full">
                       <div> {/* Content wrapper */}
                          <h3 className="text-xl font-semibold text-white mb-4 truncate" title={event.name}>{event.name}</h3>
                          <div className="space-y-2 mb-4">
                            <div className="flex justify-between items-center text-sm">
                              <span className="text-gray-400">Date</span>
                              <span className="text-white font-medium">
                                {event.date ? new Date(event.date).toLocaleDateString() : 'N/A'}
                              </span>
                            </div>
                            <div className="flex justify-between items-center text-sm">
                              <span className="text-gray-400">Time</span>
                              <span className="text-white font-medium">{event.start_time || 'N/A'}</span>
                            </div>
                          </div>
                          
                       </div>
                      <Link
                        href={`/guestlists/${event.id}`}
                        className="w-full mt-auto bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors block text-center"
                      >
                        View Guest List
                      </Link>
                    </div>
                  ))}
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-400 text-lg">No venues or events found matching your criteria.</p>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}