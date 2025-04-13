'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@/utils/supabase/client';
import { Navigation } from '@/components/navigation';
import { EventModal } from '@/components/events/event-modal';
import Link from 'next/link';

type Event = {
  id: string;
  created_at: string;
  venue_id: string;
  name: string;
  date: string;
  start_time: string;
  end_time: string;
  metadata: {
    promoter_ids?: Record<string, boolean>;
  };
  created_by: string | null;
  updated_at: string;
  location?: string;
};

export default function GuestlistsPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchEvents = async () => {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) return;

    const { data: profileData } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single();

    let eventsQuery = supabase
      .from('events')
      .select('*')
      .order('date', { ascending: true });

    if (profileData?.role !== 'admin') {
      eventsQuery = eventsQuery.contains('metadata', { promoter_ids: { [user.id]: true } });
    }

    const { data, error } = await eventsQuery;

    if (error) {
      console.error('Error fetching events:', error);
    } else {
      setEvents(data || []);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  return (
    <div className="min-h-screen bg-[#1a1d24]">
      <Navigation />
      
      {/* Content */}
      <div className="relative z-10 py-8 px-4">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-4xl font-bold text-white mb-8 text-center">Guest Lists</h1>
          
          {/* Events Section */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {loading ? (
              <div className="col-span-full text-center py-12">
                <p className="text-gray-400 text-lg">Loading events...</p>
              </div>
            ) : events.length > 0 ? (
              events.map((event) => (
                <div key={event.id} className="bg-[#262b36]/80 backdrop-blur-sm rounded-xl p-6 shadow-xl">
                  <h2 className="text-xl font-semibold text-white mb-4">{event.name}</h2>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-300">Date</span>
                      <span className="text-white font-medium">
                        {new Date(event.date).toLocaleDateString()}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-300">Time</span>
                      <span className="text-white font-medium">{event.start_time}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-300">Location</span>
                      <span className="text-white font-medium">{event.location}</span>
                    </div>
                    <Link 
                      href={`/guestlists/${event.id}`}
                      className="w-full mt-4 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors block text-center"
                    >
                      View Guest List
                    </Link>
                  </div>
                </div>
              ))
            ) : (
              <div className="col-span-full text-center py-12">
                <p className="text-gray-400 text-lg">No events currently available for you</p>
              </div>
            )}

            {/* Add New Event Card */}
            <div 
              className="bg-[#262b36]/80 backdrop-blur-sm rounded-xl p-6 shadow-xl border-2 border-dashed border-gray-600 flex items-center justify-center cursor-pointer hover:bg-[#262b36]/90 transition-colors"
              onClick={() => setIsModalOpen(true)}
            >
              <div className="text-center">
                <div className="text-4xl mb-2 text-gray-400">+</div>
                <div className="text-gray-400">Create New Event</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <EventModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={fetchEvents}
      />
    </div>
  );
} 