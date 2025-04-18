'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { NavigationWrapper } from '@/components/navigation-wrapper';
import { getVenues } from './actions';
import { Venue } from '@/types/venues';
import { useProfile } from '@/hooks/use-profile';
import Image from 'next/image';
export default function VenuesPage() {
  const [venues, setVenues] = useState<Venue[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { data: profile } = useProfile();

  useEffect(() => {
    async function fetchVenues() {
      try {
        const data = await getVenues();
        setVenues(data || []);
      } catch (error) {
        console.error('Error fetching venues:', error);
      } finally {
        setIsLoading(false);
      }
    }

    fetchVenues();
  }, []);

  return (
    <div className="min-h-screen bg-[#1a1d24]">
      <NavigationWrapper />
      
      <div className="relative z-10 py-8 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-4xl font-bold text-white">Venues</h1>
            {profile?.role === 'admin' && (
              <Link 
                href="/venues/new"
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Add New Venue
              </Link>
            )}
          </div>

          {isLoading ? (
            <div className="text-center py-12">
              <p className="text-gray-400 text-lg">Loading venues...</p>
            </div>
          ) : venues.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {venues.map((venue) => (
                <Link 
                  key={venue.id} 
                  href={`/venues/${venue.id}`}
                  className="block group"
                >
                  <div className="bg-[#2a2d35] rounded-lg shadow-xl p-6 hover:bg-[#2f3341] transition-colors">
                    <div className="relative w-full h-48 mb-2 rounded-lg overflow-hidden">
                    {venue.image_url ? (
                        <Image
                        src={venue.image_url}
                        alt={venue.name || 'Venue'}
                        fill
                        className="object-cover"
                        />
                    ) : (
                        <div className="w-full h-full bg-blue-600 flex items-center justify-center">
                        <span className="text-white text-xl font-bold">
                            {venue.name?.charAt(0) || '?'}
                        </span>
                        </div>
                    )}
                    </div>
                    <h2 className="text-xl font-semibold text-white mb-2 group-hover:text-blue-400">
                      {venue.name}
                    </h2>
                    {venue.address && (
                      <p className="text-gray-400 mb-3">{venue.address}</p>
                    )}
                    {venue.description && (
                      <p className="text-gray-300 line-clamp-2">{venue.description}</p>
                    )}
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-400 text-lg">No venues found</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}