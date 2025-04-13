import { createClient } from '@/utils/supabase/server';
import { NavigationWrapper } from '@/components/navigation-wrapper';
import { PromoterCarousel } from '@/components/promoters/promoters-carousel';

interface PageProps {
  searchParams: Promise<{
    selected?: string;
  }>;
}

export default async function PromotersPage({ searchParams }: PageProps) {
  const supabase = await createClient();
  const params = await searchParams;

  const { data: profiles, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('role', 'promoter');

  if (error) {
    console.error('Error fetching profiles:', error);
    return <div>Error loading profiles</div>;
  }

  // Get selected promoter if ID is provided
  const selectedPromoter = params.selected 
    ? profiles?.find(profile => profile.id === params.selected)
    : null;

  return (
    <div className="min-h-screen bg-[#1a1d24]">
      <NavigationWrapper />

      {/* Content */}
      <div className="relative z-10 py-4 sm:py-8 px-2 sm:px-4">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-3xl sm:text-4xl font-bold text-white mb-4 sm:mb-8 text-center">Our Promoters</h1>
          
          {/* Promoter Carousel Section */}
          <div className="mb-4 sm:mb-8">
            <PromoterCarousel 
              profiles={profiles || []} 
              selectedId={selectedPromoter?.id}
            />
          </div>


          {/* Contact Form Section */}
          <section className="mt-4 sm:mt-8 px-2 sm:px-6 lg:px-8">
            <div className="max-w-2xl mx-auto">
              <div className="bg-[#262b36]/80 backdrop-blur-sm rounded-xl p-4 sm:p-8 shadow-xl">
                <h2 className="text-xl sm:text-2xl font-bold text-white text-center mb-4 sm:mb-6">Get in Touch</h2>
                <form className="space-y-4 sm:space-y-6">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label htmlFor="name" className="block text-sm font-medium text-gray-300">
                        Name
                      </label>
                      <input
                        type="text"
                        id="name"
                        className="w-full px-3 sm:px-4 py-2 rounded-lg bg-[#1e222a]/90 border border-white/10 text-white placeholder-gray-400 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 text-sm sm:text-base"
                        placeholder="Your name"
                      />
                    </div>
                    <div className="space-y-2">
                      <label htmlFor="email" className="block text-sm font-medium text-gray-300">
                        Email
                      </label>
                      <input
                        type="email"
                        id="email"
                        className="w-full px-3 sm:px-4 py-2 rounded-lg bg-[#1e222a]/90 border border-white/10 text-white placeholder-gray-400 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 text-sm sm:text-base"
                        placeholder="your@email.com"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="message" className="block text-sm font-medium text-gray-300">
                      Message
                    </label>
                    <textarea
                      id="message"
                      rows={4}
                      className="w-full px-3 sm:px-4 py-2 rounded-lg bg-[#1e222a]/90 border border-white/10 text-white placeholder-gray-400 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 resize-none text-sm sm:text-base"
                      placeholder="Message the promoter for guestlist at the chosen event! Explain how many people and any social media you might have."
                    />
                  </div>
                  <div className="flex justify-center">
                    <button
                      type="submit"
                      className="w-full sm:w-auto px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-[#262b36] text-sm sm:text-base"
                    >
                      Send Message
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
} 