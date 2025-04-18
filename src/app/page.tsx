'use client'

import { NavigationWrapper } from '@/components/navigation-wrapper'
import { PromoterGrid } from '@/components/promoters/promoter-grid'
import { VenueGrid } from '@/components/venues/venue-grid'
import { useState } from 'react'

export default function Home() {
  const [activeTab, setActiveTab] = useState('venues')

  return (
    <div className="min-h-screen bg-[#1a1d24]">
      <NavigationWrapper/>

      {/* Hero Section */}
      <div className="relative z-10 flex items-center justify-center p-4">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-white mb-4">Welcome to PromoHub</h1>
        </div>
      </div>

      {/* Tabs Section */}
      <div className="py-12">
        <div className="text-center mb-8">
          <div className="inline-flex rounded-lg border border-gray-700 p-1 mb-6">
          <button
              className={`px-4 py-2 rounded-md ${
                activeTab === 'venues'
                  ? 'bg-gray-700 text-white'
                  : 'text-gray-400 hover:text-white'
              }`}
              onClick={() => setActiveTab('venues')}
            >
              Top Venues
            </button>
            <button
              className={`px-4 py-2 rounded-md ${
                activeTab === 'promoters'
                  ? 'bg-gray-700 text-white'
                  : 'text-gray-400 hover:text-white'
              }`}
              onClick={() => setActiveTab('promoters')}
            >
              Top Promoters
            </button>
            
          </div>
          <h2 className="text-3xl font-bold text-white mb-2">
            {activeTab === 'promoters' ? 'Top Promoters' : 'Top Venues'}
          </h2>
          <p className="text-gray-400">
            {activeTab === 'promoters'
              ? 'Discover the best event promoters in your area'
              : 'Explore the most popular venues around you'}
          </p>
        </div>
        {activeTab === 'promoters' ? <PromoterGrid /> : <VenueGrid />}      </div>
    </div>
  )
}
