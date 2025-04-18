import { createClient } from '@/utils/supabase/server';
import { NavigationWrapper } from '@/components/navigation-wrapper';
import { VenueList } from '@/components/admin/venue-list';
import { EventList } from '@/components/admin/event-list';

export default async function AdminPage() {
  const supabase = await createClient();

  const { data: venues, error: venuesError } = await supabase
    .from('venues')
    .select('*')
    .order('created_at', { ascending: false });

  const { data: events, error: eventsError } = await supabase
    .from('events')
    .select(`
      *,
      venue:venues(name)
    `)
    .order('created_at', { ascending: false });

  if (venuesError || eventsError) {
    console.error('Error fetching data:', venuesError || eventsError);
    return <div>Error loading data</div>;
  }

  return (
    <div className="min-h-screen bg-[#1a1d24]">
      <NavigationWrapper />

      {/* Content */}
      <div className="relative z-10 py-4 sm:py-8 px-2 sm:px-4">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-3xl sm:text-4xl font-bold text-white mb-4 sm:mb-8 text-center">Admin Dashboard</h1>
          
          {/* Venues Section */}
          <section className="mb-8">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold text-white">Venues</h2>
            </div>
            <VenueList initialVenues={venues || []} />
          </section>

          <section>
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold text-white">Events</h2>
            </div>
            <EventList 
              initialEvents={events || []} 
            />
          </section>
        </div>
      </div>
    </div>
  );
} 