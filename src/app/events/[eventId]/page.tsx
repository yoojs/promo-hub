'use client'; // <-- Make it a Client Component

import { useState, useEffect } from 'react'; // <-- Import hooks
import Link from 'next/link';
import { format } from 'date-fns';
import { getEventById } from '../actions';
import { NavigationWrapper } from '@/components/navigation-wrapper';
import { EventModal } from '@/components/events/event-modal'; // <-- Import your EventModal component
import { Event } from '@/types/events'; // <-- Import Event type if not already
import { use } from 'react';
import { updateEvent, deleteEvent } from '../actions';
import { getProfile } from '@/app/account/actions';
import { Profile } from '@/types/profiles'; // <-- Import Profiles type if not already
import { DeleteEventDialog } from '@/components/events/delete-event-dialog';
import { useRouter } from 'next/navigation';
import { toast } from 'react-hot-toast';
import Image from 'next/image';
interface EventDetailPageProps {
    eventId: string;
}

export default function EventDetailPage({ params }: {params: Promise<EventDetailPageProps>}) {
  const { eventId } = use(params);

  // State for the event data and loading/error
  const [event, setEvent] = useState<Event | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // State for the modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalLoading, setModalLoading] = useState(false);
  const [profileData, setProfileData] = useState<Profile | null>(null); // Adjust type as needed

  // State for delete dialog
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const router = useRouter();

  // Fetch data on the client side
  useEffect(() => {
    async function fetchEvent() {
      setIsLoading(true);
      setError(null);
      try {
        const fetchedEvent = await getEventById(eventId);
        if (!fetchedEvent) {
          setError('Event not found'); // Set error state instead of calling notFound directly
        } else {
          setEvent(fetchedEvent);
        }
      } catch (err) {
        console.error("Failed to fetch event:", err);
        setError('Failed to load event data.');
      } finally {
        setIsLoading(false);
      }
    }
    async function fetchProfile() {
      const profile = await getProfile();
      if (profile) {
        setProfileData(profile);
      }
    }
    fetchProfile();
    fetchEvent();
  }, [eventId]); // Re-fetch if eventId changes

  // Handle modal close
  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  // Handle successful save from modal
  const handleSaveSuccess = async (updatedEvent: Omit<Event, 'id' | 'created_at' | 'updated_at' | 'venue' | 'guests' | 'promoters'> & { promoters: string[] }) => {
    setModalLoading(true);
    try {
      const newEvent = {
        id: eventId,
        name: updatedEvent.name,
        description: updatedEvent.description,
        date: updatedEvent.date, 
        start_time: updatedEvent.start_time,
        end_time: updatedEvent.end_time,
        venue_id: updatedEvent.venue_id,
        image_url: updatedEvent.image_url,
        promoters: updatedEvent.promoters,
        created_by: updatedEvent.created_by,
      }
      setEvent(newEvent); // Update local state immediately
      updateEvent(eventId, newEvent); // Call the function to update the event in the database

    } finally {
      setModalLoading(false);
      handleCloseModal();
    }
    // Optionally, refresh server data if needed, though updating local state might be enough
    // router.refresh();
  };

  // Handle delete event
  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      await deleteEvent(eventId);
      toast.success('Event deleted successfully');
      router.push('/events'); // Redirect to events list
    } catch (error) {
      toast.error('Failed to delete event');
      console.error('Error deleting event:', error);
    } finally {
      setIsDeleting(false);
      setIsDeleteDialogOpen(false);
    }
  };

  // Handle loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#1a1d24] text-white flex items-center justify-center">
        Loading event details...
      </div>
    );
  }

  // Handle error state (including not found)
  if (error) {
     // You could render a specific error component or redirect
     // For 'Not Found', you might want a more specific check if needed
     // notFound(); // Calling notFound() in client components is complex, better show error message
     return (
       <div className="min-h-screen bg-[#1a1d24] text-white flex items-center justify-center">
         <p>Error: {error}</p>
       </div>
     );
  }

  // Handle case where event is null after loading (should be covered by error state now)
  if (!event) {
     return (
       <div className="min-h-screen bg-[#1a1d24] text-white flex items-center justify-center">
         Event data could not be loaded.
       </div>
     );
  }

  return (
    <> {/* Use Fragment */}
      <div className="min-h-screen bg-[#1a1d24] text-white">
        <NavigationWrapper />
        <div className="container mx-auto px-4 py-12">
          <div className="bg-[#2a2d35] rounded-lg shadow-xl p-8 max-w-4xl mx-auto">
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
            <div className="flex flex-col md:flex-row justify-between items-start mb-6 gap-4">
              
              <div>
                <h1 className="text-3xl font-bold mb-2">{event.name}</h1>
                <p className="text-gray-400 text-md">
                  {format(new Date(event.date), 'EEEE, MMMM d, yyyy')} • {event.start_time} - {event.end_time}
                </p>
              </div>
              { profileData && <div className="flex space-x-3 flex-shrink-0 mt-4 md:mt-0">
                 <Link href={`/guestlists/${eventId}`}>
                   {/* Use your Button component */}
                   <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">View Guestlist</button>
                 </Link>
                 {/* Show edit/delete buttons only for admin or event creator */}
                 {(profileData?.role === 'admin' || event.created_by === profileData?.id) && (
                   <>
                     <button 
                       className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                       onClick={() => setIsModalOpen(true)}
                     >
                       Edit Event
                     </button>
                     <button
                       className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                       onClick={() => setIsDeleteDialogOpen(true)}
                     >
                       Delete Event
                     </button>
                   </>
                 )}
              </div>}
            </div>

            {event.image_url && (
              <div className="mb-6">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={event.image_url}
                  alt={`${event.name} banner`}
                  className="w-full h-auto max-h-60 object-cover rounded-md"
                />
              </div>
            )}

            {event.description && (
              <div className="prose prose-invert max-w-none prose-p:text-gray-300 prose-headings:text-white">
                <h2 className="text-xl font-semibold mb-3">Description</h2>
                {/* Render description safely, maybe using dangerouslySetInnerHTML if it contains HTML, or just as text */}
                <p>{event.description}</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Add the delete dialog */}
      <DeleteEventDialog
        isOpen={isDeleteDialogOpen}
        onClose={() => setIsDeleteDialogOpen(false)}
        onConfirm={handleDelete}
        eventName={event?.name || ''}
        loading={isDeleting}
      />
      
      {/* Existing EventModal */}
      <EventModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        event={event} // Pass the current event data for editing
        onSave={handleSaveSuccess} // Pass the success handler
        loading={modalLoading}
      />
    </>
  );
}