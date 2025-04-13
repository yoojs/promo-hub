import { NavigationWrapper } from '@/components/navigation-wrapper'
import { PromoterGrid } from '@/components/promoters/promoter-grid'

export default async function Home() {


  return (
    <div className="min-h-screen bg-[#1a1d24]">
      <NavigationWrapper/>

      {/* Hero Section */}
      <div className="relative z-10 flex items-center justify-center p-4">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-white mb-4">Welcome to WeOut</h1>

        </div>
      </div>

      {/* Promoters Section */}
      <div className="py-12">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-white mb-2">Top Promoters</h2>
          <p className="text-gray-400">Discover the best event promoters in your area</p>
        </div>
        <PromoterGrid />
      </div>
    </div>
  )
}
