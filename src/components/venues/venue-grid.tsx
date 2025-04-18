'use client'

import { useEffect, useState } from 'react'
import { useInView } from 'react-intersection-observer'
import { getVenues } from '@/app/actions'
import { Venue } from '@/types/venues'
import Image from 'next/image'
import Link from 'next/link'


interface VenueGridProps {
  showAllByDefault?: boolean;
}

export function VenueGrid({ showAllByDefault = false }: VenueGridProps) {
  const [venues, setVenues] = useState<Venue[]>([])
  const [page, setPage] = useState(1)
  const [loading, setLoading] = useState(false)
  const [hasMore, setHasMore] = useState(true)
  const [showAll, setShowAll] = useState(showAllByDefault)
  const { ref, inView } = useInView()

  const loadMoreVenues = async () => {
    if (loading) return;
    setLoading(true)
    try {
      const { venues: newVenues, total } = await getVenues(page)
      setVenues(prev => {
        const existingIds = new Set(prev.map(v => v.id))
        const uniqueNewVenues = newVenues.filter(v => !existingIds.has(v.id))
        return [...prev, ...uniqueNewVenues]
      })
      setPage(prev => prev + 1)
      setHasMore(venues.length + newVenues.length < total)
    } catch (error) {
      console.error('Error loading venues:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadMoreVenues()
  }, [])

  useEffect(() => {
    if (inView && hasMore && showAll) {
      loadMoreVenues()
    }
  }, [inView, hasMore, showAll])

  return (
    <div className="w-full max-w-7xl mx-auto px-4">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {venues.slice(0, showAll ? undefined : 6).map((venue) => (
          <Link 
            key={venue.id}
            href={`/venues/${venue.id}`}
            className="bg-white/5 rounded-lg p-4 hover:bg-white/10 transition-colors"
          >
            <div className="space-y-4">
              <div className="relative w-full h-48 rounded-lg overflow-hidden">
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
              <div>
                <h3 className="text-white font-semibold text-lg">{venue.name || 'Unknown Venue'}</h3>
                {venue.address && (
                  <p className="text-gray-400 text-sm mt-1">{venue.address}</p>
                )}
                {venue.events && <p className="text-gray-400 text-sm mt-1">{venue.events?.length} events</p>}
                {venue.description && (
                  <p className="text-gray-400 text-sm mt-2 line-clamp-2">{venue.description}</p>
                )}
              </div>
            </div>
          </Link>
        ))}
      </div>
      
      {!showAll && venues.length > 6 && (
        <div className="text-center mt-8">
          <button
            onClick={() => setShowAll(true)}
            className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition-colors"
          >
            See All Venues
          </button>
        </div>
      )}

      {showAll && hasMore && (
        <div ref={ref} className="h-20 flex items-center justify-center">
          {loading && (
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
          )}
        </div>
      )}
    </div>
  )
}