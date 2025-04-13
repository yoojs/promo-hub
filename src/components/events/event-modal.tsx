'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@/utils/supabase/client';
import { Database } from '@/types/supabase';

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
  description?: string;
  capacity?: number;
  price?: number;
};

type Profile = Database['public']['Tables']['profiles']['Row'];

interface EventModalProps {
  isOpen: boolean;
  onClose: () => void;
  event?: Event;
  onSuccess: () => void;
}

export function EventModal({ isOpen, onClose, event, onSuccess }: EventModalProps) {
  const [loading, setLoading] = useState(false);
  const [promoters, setPromoters] = useState<Profile[]>([]);
  const [selectedPromoters, setSelectedPromoters] = useState<string[]>([]);
  const [formData, setFormData] = useState({
    name: event?.name || '',
    date: event?.date || '',
    start_time: event?.start_time || '',
    location: event?.location || '',
    description: event?.description || '',
    capacity: event?.capacity || 0,
    price: event?.price || 0,
  });

  useEffect(() => {
    if (isOpen) {
      fetchPromoters();
      if (event?.metadata?.promoter_ids) {
        setSelectedPromoters(Object.keys(event.metadata.promoter_ids));
      }
    }
  }, [isOpen, event]);

  const fetchPromoters = async () => {
    const supabase = createClient();
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('role', 'promoter');

    if (error) {
      console.error('Error fetching promoters:', error);
    } else {
      setPromoters(data || []);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const supabase = createClient();
      const promoterIds = selectedPromoters.reduce((acc, id) => {
        acc[id] = true;
        return acc;
      }, {} as Record<string, boolean>);

      const eventData = {
        ...formData,
        metadata: {
          promoter_ids: promoterIds,
        },
      };

      if (event) {
        const { error } = await supabase
          .from('events')
          .update(eventData)
          .eq('id', event.id);
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('events')
          .insert([eventData]);
        if (error) throw error;
      }

      onSuccess();
      onClose();
    } catch (error) {
      console.error('Error saving event:', error);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-[#262b36] rounded-lg p-6 w-full max-w-2xl">
        <h2 className="text-2xl font-bold text-white mb-6">
          {event ? 'Edit Event' : 'Create New Event'}
        </h2>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">
                Event Name
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-4 py-2 rounded-md bg-[#1e222a] border border-white/10 text-white"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">
                Date
              </label>
              <input
                type="date"
                value={formData.date}
                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                className="w-full px-4 py-2 rounded-md bg-[#1e222a] border border-white/10 text-white"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">
                Start Time
              </label>
              <input
                type="time"
                value={formData.start_time}
                onChange={(e) => setFormData({ ...formData, start_time: e.target.value })}
                className="w-full px-4 py-2 rounded-md bg-[#1e222a] border border-white/10 text-white"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">
                Location
              </label>
              <input
                type="text"
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                className="w-full px-4 py-2 rounded-md bg-[#1e222a] border border-white/10 text-white"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">
                Capacity
              </label>
              <input
                type="number"
                value={formData.capacity}
                onChange={(e) => setFormData({ ...formData, capacity: parseInt(e.target.value) })}
                className="w-full px-4 py-2 rounded-md bg-[#1e222a] border border-white/10 text-white"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">
                Price
              </label>
              <input
                type="number"
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: parseFloat(e.target.value) })}
                className="w-full px-4 py-2 rounded-md bg-[#1e222a] border border-white/10 text-white"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">
              Description
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full px-4 py-2 rounded-md bg-[#1e222a] border border-white/10 text-white"
              rows={3}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">
              Promoters
            </label>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
              {promoters.map((promoter) => (
                <label key={promoter.id} className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={selectedPromoters.includes(promoter.id)}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setSelectedPromoters([...selectedPromoters, promoter.id]);
                      } else {
                        setSelectedPromoters(selectedPromoters.filter(id => id !== promoter.id));
                      }
                    }}
                    className="rounded border-white/10 text-blue-500 focus:ring-blue-500"
                  />
                  <span className="text-white">{promoter.full_name}</span>
                </label>
              ))}
            </div>
          </div>

          <div className="flex justify-end space-x-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-md text-sm font-medium text-gray-300 hover:text-white hover:bg-white/5"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 rounded-md text-sm font-medium bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50"
            >
              {loading ? 'Saving...' : 'Save Event'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
} 