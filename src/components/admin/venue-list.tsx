'use client';

import { useState } from 'react';
import { createClient } from '@/utils/supabase/client';
import { VenueModal } from '../venues/venue-modal';

interface Venue {
  id: string;
  name: string;
  description: string | null;
  created_at: string;
  updated_at: string;
}

interface VenueListProps {
  initialVenues: Venue[];
}

export function VenueList({ initialVenues }: VenueListProps) {
  const [venues, setVenues] = useState(initialVenues);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedVenue, setSelectedVenue] = useState<Venue | null>(null);
  const [loading, setLoading] = useState(false);

  const handleAddVenue = () => {
    setSelectedVenue(null);
    setIsModalOpen(true);
  };

  const handleEditVenue = (venue: Venue) => {
    setSelectedVenue(venue);
    setIsModalOpen(true);
  };

  const handleDeleteVenue = async (id: string) => {
    if (!confirm('Are you sure you want to delete this venue?')) return;

    setLoading(true);
    const supabase = createClient();

    try {
      const { error } = await supabase
        .from('venues')
        .delete()
        .eq('id', id);

      if (error) throw error;

      setVenues(venues.filter(venue => venue.id !== id));
    } catch (error) {
      console.error('Error deleting venue:', error);
      alert('Error deleting venue');
    } finally {
      setLoading(false);
    }
  };

  const handleSaveVenue = async (venueData: Omit<Venue, 'id' | 'created_at' | 'updated_at'>) => {
    setLoading(true);
    const supabase = createClient();

    try {
      if (selectedVenue) {
        // Update existing venue
        const { error } = await supabase
          .from('venues')
          .update({
            ...venueData,
            updated_at: new Date().toISOString(),
          })
          .eq('id', selectedVenue.id);

        if (error) throw error;

        setVenues(venues.map(venue => 
          venue.id === selectedVenue.id 
            ? { ...venue, ...venueData, updated_at: new Date().toISOString() }
            : venue
        ));
      } else {
        // Create new venue
        const { data, error } = await supabase
          .from('venues')
          .insert([venueData])
          .select()
          .single();

        if (error) throw error;

        setVenues([data, ...venues]);
      }

      setIsModalOpen(false);
      setSelectedVenue(null);
    } catch (error) {
      console.error('Error saving venue:', error);
      alert('Error saving venue');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <button
          onClick={handleAddVenue}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          Add Venue
        </button>
      </div>

      <div className="bg-[#262b36]/80 backdrop-blur-sm rounded-xl overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-white/10">
              <th className="px-4 py-3 text-left text-white font-semibold">Name</th>
              <th className="px-4 py-3 text-left text-white font-semibold">Description</th>
              <th className="px-4 py-3 text-left text-white font-semibold">Created</th>
              <th className="px-4 py-3 text-left text-white font-semibold">Actions</th>
            </tr>
          </thead>
          <tbody>
            {venues.map((venue) => (
              <tr key={venue.id} className="border-b border-white/10">
                <td className="px-4 py-3 text-white">{venue.name}</td>
                <td className="px-4 py-3 text-gray-400">{venue.description || '-'}</td>
                <td className="px-4 py-3 text-gray-400">
                  {new Date(venue.created_at).toLocaleDateString()}
                </td>
                <td className="px-4 py-3">
                  <div className="flex space-x-2">
                    <button
                      onClick={() => handleEditVenue(venue)}
                      className="text-blue-400 hover:text-blue-300 transition-colors"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDeleteVenue(venue.id)}
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
      </div>

      <VenueModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedVenue(null);
        }}
        onSave={handleSaveVenue}
        venue={selectedVenue}
        loading={loading}
      />
    </div>
  );
} 