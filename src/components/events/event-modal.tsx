'use client';

import { useState, useEffect } from 'react';
import { Event } from '@/types/events';
import { getAllVenues, getAllPromoters } from '@/app/actions';
interface Venue {
  id: string;
  name: string;
}

interface Promoter {
  id: string;
  full_name: string;
}


interface EventModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (eventData: Omit<Event, 'id' | 'created_at' | 'updated_at' | 'venue' | 'guests' | 'promoters'> & { promoters: string[] }) => Promise<void>;
  event: Event | null;
  loading: boolean;
}

export function EventModal({ isOpen, onClose, onSave, event, loading }: EventModalProps) {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [date, setDate] = useState('');
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');
  const [venueId, setVenueId] = useState('');
  const [selectedPromoterIds, setSelectedPromoterIds] = useState<string[]>([]);
  const [venues, setVenues] = useState<Venue[]>([]);
  const [promoters, setPromoters] = useState<Promoter[]>([]);
  useEffect(() => {
    const fetchVenues = async () => {
      const venues = await getAllVenues();
      setVenues(venues);
    };
    fetchVenues();
    const fetchPromoters = async () => { 
      const promoters = await getAllPromoters();
      setPromoters(promoters);
    }
    fetchPromoters();
    if (event) {
      setName(event.name);
      setDescription(event.description || '');
      setDate(event.date.split('T')[0]); // Convert ISO date to YYYY-MM-DD format
      setStartTime(event.start_time);
      setEndTime(event.end_time);
      setVenueId(event.venue_id);
      // Parse promoters from JSON string if it's a string, otherwise use empty array
      setSelectedPromoterIds(
        typeof event.promoters === 'string' 
          ? JSON.parse(event.promoters) 
          : Array.isArray(event.promoters) 
            ? event.promoters 
            : []
      );
    } else {
      setName('');
      setDescription('');
      setDate('');
      setStartTime('');
      setEndTime('');
      setVenueId('');
      setSelectedPromoterIds([]);
    }
  }, [event]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSave({ 
      name, 
      description: description, 
      date, 
      start_time: startTime,
      end_time: endTime,
      venue_id: venueId,
      promoters: selectedPromoterIds
    });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-[#262b36] rounded-xl p-6 w-full max-w-md">
        <h2 className="text-2xl font-bold text-white mb-4">
          {event ? 'Edit Event' : 'Add Event'}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-300 mb-1">
              Name
            </label>
            <input
              type="text"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-4 py-2 rounded-lg bg-[#1e222a]/90 border border-white/10 text-white placeholder-gray-400 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
              required
            />
          </div>

          <div>
            <label htmlFor="venue" className="block text-sm font-medium text-gray-300 mb-1">
              Venue
            </label>
            <select
              id="venue"
              value={venueId}
              onChange={(e) => setVenueId(e.target.value)}
              className="w-full px-4 py-2 rounded-lg bg-[#1e222a]/90 border border-white/10 text-white placeholder-gray-400 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
              required
            >
              <option value="">Select a venue</option>
              {venues.map((venue) => (
                <option key={venue.id} value={venue.id}>
                  {venue.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="date" className="block text-sm font-medium text-gray-300 mb-1">
              Date
            </label>
            <input
              type="date"
              id="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full px-4 py-2 rounded-lg bg-[#1e222a]/90 border border-white/10 text-white placeholder-gray-400 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="startTime" className="block text-sm font-medium text-gray-300 mb-1">
                Start Time
              </label>
              <input
                type="time"
                id="startTime"
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
                className="w-full px-4 py-2 rounded-lg bg-[#1e222a]/90 border border-white/10 text-white placeholder-gray-400 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                required
              />
            </div>

            <div>
              <label htmlFor="endTime" className="block text-sm font-medium text-gray-300 mb-1">
                End Time
              </label>
              <input
                type="time"
                id="endTime"
                value={endTime}
                onChange={(e) => setEndTime(e.target.value)}
                className="w-full px-4 py-2 rounded-lg bg-[#1e222a]/90 border border-white/10 text-white placeholder-gray-400 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                required
              />
            </div>
          </div>

          <div>
            <label htmlFor="promoters" className="block text-sm font-medium text-gray-300 mb-1">
              Promoters
            </label>
            <select
              id="promoters"
              multiple
              value={selectedPromoterIds}
              onChange={(e) => {
                const selectedOptions = Array.from(e.target.selectedOptions, option => option.value);
                setSelectedPromoterIds(selectedOptions);
              }}
              className="w-full px-4 py-2 rounded-lg bg-[#1e222a]/90 border border-white/10 text-white placeholder-gray-400 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 min-h-[120px]"
            >
              {promoters.map((promoter) => (
                <option key={promoter.id} value={promoter.id}>
                  {promoter.full_name}
                </option>
              ))}
            </select>
            <p className="mt-1 text-sm text-gray-400">Hold Ctrl/Cmd to select multiple promoters</p>
          </div>

          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-300 mb-1">
              Description
            </label>
            <textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={4}
              placeholder="Enter event description..."
              className="w-full px-4 py-2 rounded-lg bg-[#1e222a]/90 border border-white/10 text-white placeholder-gray-400 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
            />
          </div>

          <div className="flex justify-end space-x-4 mt-6">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-300 hover:text-white transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
            >
              {loading ? 'Saving...' : 'Save'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
} 