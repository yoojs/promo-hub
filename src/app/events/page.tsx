'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { createEvent, getEvents } from './actions';
import { format } from 'date-fns';
import { NavigationWrapper } from '@/components/navigation-wrapper';
import { getProfile } from '@/app/account/actions';
import { EventModal } from '@/components/events/event-modal';
import { Event } from '@/types/events';
import { Profile } from '@/types/profiles';
import Image from 'next/image';
export default function EventsPage() {
  const [events, setEvents] = useState<Event[]>([]);
  const [profileData, setProfileData] = useState<Profile | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalLoading, setModalLoading] = useState(false);

  useEffect(() => {
    async function fetchData() {
      const [eventsData, profile] = await Promise.all([
        getEvents(),
        getProfile()
      ]);
      setEvents(eventsData || []);
      setProfileData(profile);
    }
    fetchData();
  }, []);

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleSaveSuccess = async (newEvent: Omit<Event, 'id' | 'created_at' | 'updated_at' | 'venue' | 'guests' | 'promoters'> & { promoters: string[] }) => {
    setModalLoading(true);
    try {
      // After successful creation, refresh the events list
        const createdEvent = await createEvent(newEvent);
        setEvents((prevEvents) => [...prevEvents, createdEvent]);
    } finally {
        setModalLoading(false);
        handleCloseModal();
    }
  };

  return (
    <>
      <div className="min-h-screen bg-[#1a1d24]">
        <NavigationWrapper />
        <div className="container mx-auto px-4 py-8 text-white">
          {profileData && (
            <div className="flex justify-between items-center mb-8">
              <h1 className="text-3xl font-bold">Events</h1>
              <button
                onClick={() => setIsModalOpen(true)}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Create Event
              </button>
            </div>
          )}

          {events.length === 0 ? (
            <p className="text-gray-400">No events found.</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {events.map((event) => (
                <Link key={event.id} href={`/events/${event.id}`} className="block group">
                  <div className="bg-[#2a2d35] rounded-lg p-6 shadow-lg hover:shadow-xl transition-shadow duration-300 h-full flex flex-col justify-between">
                    <div>
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
                      <h2 className="text-xl font-semibold mb-2 group-hover:text-blue-400 transition-colors duration-300">
                        {event.name}
                      </h2>
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
                      <span className="text-xs text-blue-400 group-hover:underline">View Details</span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>

        <EventModal
            isOpen={isModalOpen}
            onClose={handleCloseModal}
            onSave={handleSaveSuccess}
            loading={modalLoading} 
            event={null}     
        />
    </>
  );
}