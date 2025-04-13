'use client'

import { useEffect, useState } from 'react'
import { useInView } from 'react-intersection-observer'
import { getPromoters } from '@/app/actions'
import Image from 'next/image'
import Link from 'next/link'

interface Promoter {
  id: string;
  full_name: string;
  company?: string;
  role?: string;
  event_count: number;
  avatar_url?: string;
}

interface PromoterGridProps {
  showAllByDefault?: boolean;
}

export function PromoterGrid({ showAllByDefault = false }: PromoterGridProps) {
  const [promoters, setPromoters] = useState<Promoter[]>([])
  const [page, setPage] = useState(1)
  const [loading, setLoading] = useState(false)
  const [hasMore, setHasMore] = useState(true)
  const [showAll, setShowAll] = useState(showAllByDefault)
  const { ref, inView } = useInView()

  const loadMorePromoters = async () => {
    if (loading) return;
    setLoading(true)
    try {
      const { promoters: newPromoters, total } = await getPromoters(page)
      setPromoters(prev => {
        const existingIds = new Set(prev.map(p => p.id))
        const uniqueNewPromoters = newPromoters.filter(p => !existingIds.has(p.id))
        return [...prev, ...uniqueNewPromoters]
      })
      setPage(prev => prev + 1)
      setHasMore(promoters.length + newPromoters.length < total)
    } catch (error) {
      console.error('Error loading promoters:', error)
    } finally {
      setLoading(false)
    }
  }

  // Initial load
useEffect(() => {
    loadMorePromoters()
  }, [])

  // Load more when scrolling and showAll is true
  useEffect(() => {
    if (inView && hasMore && showAll) {
      loadMorePromoters()
    }
  }, [inView, hasMore, showAll])

  return (
    <div className="w-full max-w-7xl mx-auto px-4">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {promoters.slice(0, showAll ? undefined : 6).map((promoter) => (
          <Link 
            key={promoter.id}
            href={`/promoters?selected=${promoter.id}`}
            className="bg-white/5 rounded-lg p-4 hover:bg-white/10 transition-colors"
          >
            <div className="flex items-center space-x-4">
              <div className="relative w-16 h-16 rounded-full overflow-hidden">
                {promoter.avatar_url ? (
                  <Image
                    src={promoter.avatar_url}
                    alt={promoter.full_name || 'Promoter'}
                    fill
                    className="object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-blue-600 flex items-center justify-center">
                    <span className="text-white text-xl font-bold">
                      {promoter.full_name?.charAt(0) || '?'}
                    </span>
                  </div>
                )}
              </div>
              <div>
                <h3 className="text-white font-semibold">{promoter.full_name || 'Unknown Promoter'}</h3>
                {promoter.company && (
                  <p className="text-gray-400 text-sm">{promoter.company}</p>
                )}
                <p className="text-gray-400 text-sm">{promoter.event_count} events</p>
              </div>
            </div>
          </Link>
        ))}
      </div>
      
      {!showAll && promoters.length > 6 && (
        <div className="text-center mt-8">
          <button
            onClick={() => setShowAll(true)}
            className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition-colors"
          >
            See All Promoters
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