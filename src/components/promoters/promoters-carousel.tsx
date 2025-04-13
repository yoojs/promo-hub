'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';
import Image from 'next/image';
import { useRouter, useSearchParams } from 'next/navigation';
import { useSwipeable } from 'react-swipeable';
import { FaInstagram, FaTwitter, FaFacebook, FaTiktok } from 'react-icons/fa';

interface Profile {
  id: string;
  full_name: string;
  company?: string;
  avatar_url?: string;
  website?: string;
  description?: string;
  social_media?: {
    instagram?: string;
    twitter?: string;
    facebook?: string;
    tiktok?: string;
  };
}

interface PromoterCarouselProps {
  profiles: Profile[];
  selectedId?: string;
}

export function PromoterCarousel({ profiles, selectedId }: PromoterCarouselProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [currentIndex, setCurrentIndex] = useState(0);

  // Initialize currentIndex based on selectedId
  useEffect(() => {
    if (selectedId) {
      const index = profiles.findIndex(profile => profile.id === selectedId);
      if (index !== -1) {
        setCurrentIndex(index);
      }
    }
  }, [selectedId, profiles]);

  const nextSlide = useCallback(() => {
    setCurrentIndex((prevIndex) => 
      prevIndex === profiles.length - 1 ? 0 : prevIndex + 1
    );
  }, [profiles.length]);

  const prevSlide = useCallback(() => {
    setCurrentIndex((prevIndex) => 
      prevIndex === 0 ? profiles.length - 1 : prevIndex - 1
    );
  }, [profiles.length]);

  // Handle swipe gestures
  const swipeHandlers = useSwipeable({
    onSwipedLeft: nextSlide,
    onSwipedRight: prevSlide,
    trackMouse: true,
  });

  // Memoize the current URL params
  const currentParams = useMemo(() => {
    const params = new URLSearchParams(searchParams.toString());
    if (profiles[currentIndex]) {
      params.set('selected', profiles[currentIndex].id);
    } else {
      params.delete('selected');
    }
    return params.toString();
  }, [currentIndex, profiles, searchParams]);

  // Update URL when currentIndex changes
  useEffect(() => {
    router.push(`/promoters?${currentParams}`, { scroll: false });
  }, [currentParams, router]);

  return (
    <div className="relative max-w-2xl mx-auto px-4 sm:px-0">
      <div className="overflow-hidden" {...swipeHandlers}>
        <div 
          className="flex transition-transform duration-300 ease-in-out"
          style={{ transform: `translateX(-${currentIndex * 100}%)` }}
        >
          {profiles.map((profile) => (
            <div
              key={profile.id}
              className="w-full flex-shrink-0"
            >
              <div className="bg-[#262b36]/80 backdrop-blur-sm rounded-xl p-4 sm:p-6 shadow-xl">
                <div className="flex flex-col items-center text-center space-y-4">
                  {/* Avatar */}
                  <div className="relative w-24 h-24 sm:w-32 sm:h-32 rounded-full overflow-hidden">
                    {profile.avatar_url ? (
                      <Image
                        src={profile.avatar_url}
                        alt={profile.full_name || 'Promoter'}
                        fill
                        className="object-cover"
                      />
                    ) : (
                      <div className="w-full h-full bg-blue-600 flex items-center justify-center">
                        <span className="text-white text-2xl sm:text-3xl font-bold">
                          {profile.full_name?.charAt(0) || '?'}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Profile Info */}
                  <div className="space-y-2">
                    <h2 className="text-xl sm:text-2xl font-bold text-white">
                      {profile.full_name || 'Unknown Promoter'}
                    </h2>
                    {profile.company && (
                      <p className="text-gray-300 text-sm sm:text-base">
                        {profile.company}
                      </p>
                    )}
                  </div>

                  {/* Description */}
                  {profile.description && (
                    <div className="space-y-2">
                      <h3 className="text-lg font-semibold text-white">Description</h3>
                      <p className="text-gray-400 text-sm sm:text-base max-w-md">
                        {profile.description}
                      </p>
                    </div>
                  )}

                  {/* Social Media */}
                  {profile.social_media && Object.keys(profile.social_media).length > 0 && (
                    <div className="space-y-2">
                      <h3 className="text-lg font-semibold text-white">Follow Me!</h3>
                      <div className="flex flex-wrap justify-center gap-6">
                        {profile.social_media.instagram && (
                          <a
                            href={`https://instagram.com/${profile.social_media.instagram}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-pink-500 hover:text-pink-400 transition-colors"
                            aria-label="Instagram"
                          >
                            <FaInstagram className="w-6 h-6 sm:w-8 sm:h-8" />
                          </a>
                        )}
                        {profile.social_media.twitter && (
                          <a
                            href={`https://twitter.com/${profile.social_media.twitter}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-400 hover:text-blue-300 transition-colors"
                            aria-label="Twitter"
                          >
                            <FaTwitter className="w-6 h-6 sm:w-8 sm:h-8" />
                          </a>
                        )}
                        {profile.social_media.facebook && (
                          <a
                            href={`https://facebook.com/${profile.social_media.facebook}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600 hover:text-blue-500 transition-colors"
                            aria-label="Facebook"
                          >
                            <FaFacebook className="w-6 h-6 sm:w-8 sm:h-8" />
                          </a>
                        )}
                        {profile.social_media.tiktok && (
                          <a
                            href={`https://tiktok.com/@${profile.social_media.tiktok}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-gray-100 hover:text-gray-200 transition-colors"
                            aria-label="TikTok"
                          >
                            <FaTiktok className="w-6 h-6 sm:w-8 sm:h-8" />
                          </a>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Website */}
                  {profile.website && (
                    <a
                      href={profile.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-400 hover:text-blue-300 text-sm sm:text-base transition-colors"
                    >
                      Visit Website →
                    </a>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Navigation Buttons */}
      <button
        onClick={prevSlide}
        className="absolute left-0 top-1/2 -translate-y-1/2 bg-black/50 text-white p-1.5 sm:p-2 rounded-full hover:bg-black/70 transition-colors -translate-x-2 sm:-translate-x-12"
      >
        ←
      </button>
      <button
        onClick={nextSlide}
        className="absolute right-0 top-1/2 -translate-y-1/2 bg-black/50 text-white p-1.5 sm:p-2 rounded-full hover:bg-black/70 transition-colors translate-x-2 sm:translate-x-12"
      >
        →
      </button>

      {/* Dots */}
      <div className="flex justify-center space-x-2 mt-4">
        {profiles.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentIndex(index)}
            className={`w-2 h-2 rounded-full transition-colors ${
              index === currentIndex ? 'bg-blue-500' : 'bg-gray-600 hover:bg-gray-500'
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
} 