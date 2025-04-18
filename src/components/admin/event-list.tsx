'use client';

import { useState } from 'react';
import { createClient } from '@/utils/supabase/client';
import { EventModal } from '../events/event-modal';
import { Event } from '@/types/events';

interface EventListProps {
  initialEvents: Event[];
}

export function EventList({ initialEvents }: EventListProps) {
  const [events, setEvents] = useState(initialEvents);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [loading, setLoading] = useState(false);

  const handleAddEvent = () => {
    setSelectedEvent(null);
    setIsModalOpen(true);
  };

  // const handleEditEvent = (event: Event) => {
  //   setSelectedEvent(event);
  //   setIsModalOpen(true);
  // };

  // const handleDeleteEvent = async (id: string) => {
  //   if (!confirm('Are you sure you want to delete this event?')) return;

  //   setLoading(true);
  //   const supabase = createClient();

  //   try {
  //     const { error } = await supabase
  //       .from('events')
  //       .delete()
  //       .eq('id', id);

  //     if (error) throw error;

  //     setEvents(events.filter(event => event.id !== id));
  //   } catch (error) {
  //     console.error('Error deleting event:', error);
  //     alert('Error deleting event');
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  const handleSaveEvent = async (eventData: Omit<Event, 'id' | 'created_at' | 'updated_at' | 'venue' | 'guests' | 'promoters'> & { promoters: string[] }) => {
    setLoading(true);
    const supabase = createClient();

    try {
      const guests = {
        // Initialize with empty guests object
      };

      if (selectedEvent) {
        // Update existing event
        const { error } = await supabase
          .from('events')
          .update({
            ...eventData,
            guests,
            promoters: JSON.stringify(eventData.promoters),
            updated_at: new Date().toISOString(),
          })
          .eq('id', selectedEvent.id);

        if (error) throw error;

        
      } else {
        // Create new event
        const { data, error } = await supabase
          .from('events')
          .insert([{
            ...eventData,
            guests,
            promoters: JSON.stringify(eventData.promoters)
          }])
          .select(`
            *,
            venue:venues(name)
          `)
          .single();

        if (error) throw error;

        setEvents([data, ...events]);
      }

      setIsModalOpen(false);
      setSelectedEvent(null);
    } catch (error) {
      console.error('Error saving event:', error);
      alert('Error saving event');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <button
          onClick={handleAddEvent}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          Add Event
        </button>
      </div>

      {/* <div className="bg-[#262b36]/80 backdrop-blur-sm rounded-xl overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-white/10">
              <th className="px-4 py-3 text-left text-white font-semibold">Name</th>
              <th className="px-4 py-3 text-left text-white font-semibold">Venue</th>
              <th className="px-4 py-3 text-left text-white font-semibold">Date</th>
              <th className="px-4 py-3 text-left text-white font-semibold">Time</th>
              <th className="px-4 py-3 text-left text-white font-semibold">Promoters</th>
              <th className="px-4 py-3 text-left text-white font-semibold">Description</th>
              <th className="px-4 py-3 text-left text-white font-semibold">Created</th>
              <th className="px-4 py-3 text-left text-white font-semibold">Actions</th>
            </tr>
          </thead>
          <tbody>
            {events.map((event) => (
              <tr key={event.id} className="border-b border-white/10">
                <td className="px-4 py-3 text-white">{event.name}</td>
                <td className="px-4 py-3 text-white">{event.venue.name}</td>
                <td className="px-4 py-3 text-gray-400">
                  {new Date(event.date).toLocaleDateString()}
                </td>
                <td className="px-4 py-3 text-gray-400">
                  {new Date(`2000-01-01T${event.start_time}`).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} - {new Date(`2000-01-01T${event.end_time}`).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </td>
                <td className="px-4 py-3 text-gray-400">
                  {Array.isArray(event.promoters) 
                    ? event.promoters.map(id => promoters.find(p => p.id === id)?.full_name).filter(Boolean).join(', ') 
                    : '-'}
                </td>
                <td className="px-4 py-3 text-gray-400">{event.description || '-'}</td>
                <td className="px-4 py-3 text-gray-400">
                  {new Date(event.created_at).toLocaleDateString()}
                </td>
                <td className="px-4 py-3">
                  <div className="flex space-x-2">
                    <button
                      onClick={() => handleEditEvent(event)}
                      className="text-blue-400 hover:text-blue-300 transition-colors"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDeleteEvent(event.id)}
                      className="text-red-400 hover:text-red-300 transition-colors"
                      disabled={loading}
                    >
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div> */}

      <EventModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedEvent(null);
        }}
        onSave={handleSaveEvent}
        event={selectedEvent}
        loading={loading}
      />
    </div>
  );
} 