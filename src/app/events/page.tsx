import Link from 'next/link';
import { getEvents } from './actions';
import { format } from 'date-fns';
import { NavigationWrapper } from '@/components/navigation-wrapper';
import { getProfile } from '@/app/account/actions';
export default async function EventsPage() {
  const events = await getEvents();
    const profileData = await getProfile();;
    
  return (
    <div className="min-h-screen bg-[#1a1d24]">
        <NavigationWrapper />
        <div className="container mx-auto px-4 py-8 text-white">
        {profileData && <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-bold">Events</h1>
            <Link href="/events/new">
            <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                Create Event
            </button>
            </Link>
        </div>}

        {events.length === 0 ? (
            <p className="text-gray-400">No events found.</p>
        ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {events.map((event) => (
                <Link key={event.id} href={`/events/${event.id}`} className="block group">
                <div className="bg-[#2a2d35] rounded-lg p-6 shadow-lg hover:shadow-xl transition-shadow duration-300 h-full flex flex-col justify-between">
                    <div>
                    <h2 className="text-xl font-semibold mb-2 group-hover:text-blue-400 transition-colors duration-300">{event.name}</h2>
                    <p className="text-gray-400 mb-1 text-sm">
                        <span className="font-medium">Date:</span> {format(new Date(event.date), 'PPP')}
                    </p>
                    <p className="text-gray-400 mb-1 text-sm">
                    <span className="font-medium">Time:</span> {event.start_time} to {event.end_time}
                    </p>
                    {event.description && (
                        <p className="text-gray-300 text-sm mb-4 line-clamp-3">{event.description}</p>
                    )}
                    </div>
                    <div className="mt-4 pt-4 border-t border-gray-700">
                    {/* You might want to add guest count or other stats here later */}
                    <span className="text-xs text-blue-400 group-hover:underline">View Details</span>
                    </div>
                </div>
                </Link>
            ))}
            </div>
        )}
        </div>
    </div>
  );
}

// Optional: Add dynamic='force-dynamic' if you always want the latest data without caching
// export const dynamic = 'force-dynamic';