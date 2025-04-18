'use client';

import { useState, useEffect } from 'react';
import { GuestModal } from './guest-modal';
import { ToastContainer, toast } from 'react-toastify';
import { checkInGuest } from '@/app/guestlists/[eventId]/actions';
import { CSVImportButton } from '@/components/csv-import-button';
import { useProfile } from '@/hooks/use-profile';

export interface Guest {
  added_by: string | undefined;
  id: string;
  full_name: string;
  email: string;
  phone: string;  
  instagram?: string;
  checked_in: boolean;
  check_in_time: string | null;
  added_at: string;
  note?: string | null;
  rejected?: boolean;
}

interface GuestListProps {
  eventId: string;
  initialGuests: Guest[];
  searchInputId: string;
}

export function GuestList({ eventId, initialGuests, searchInputId }: GuestListProps) {
  const [guests, setGuests] = useState(initialGuests);
  const [filteredGuests, setFilteredGuests] = useState(initialGuests);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedGuest, setSelectedGuest] = useState<Guest | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { data: profile } = useProfile();

  const [isNotCheckedInOpen, setIsNotCheckedInOpen] = useState(true);
  const [isCheckedInOpen, setIsCheckedInOpen] = useState(true);
  const [isRejectedOpen, setIsRejectedOpen] = useState(true);

  useEffect(() => {
    const searchInput = document.getElementById(searchInputId) as HTMLInputElement
    if (!searchInput) return

    const handleSearch = () => {
      const query = searchInput.value.toLowerCase().trim()
      if (!query) {
        setFilteredGuests(guests)
        return
      }

      const filtered = guests.filter(guest => {
        const fullName = guest.full_name?.toLowerCase() || ''
        const email = guest.email?.toLowerCase() || ''
        const phone = guest.phone?.toLowerCase() || ''
        const instagram = guest.instagram?.toLowerCase() || ''

        return fullName.includes(query) ||
               email.includes(query) ||
               phone.includes(query) ||
               instagram.includes(query)
      })

      setFilteredGuests(filtered)
    }

    searchInput.addEventListener('input', handleSearch)
    return () => searchInput.removeEventListener('input', handleSearch)
  }, [searchInputId, guests])

  const handleCheckIn = async (guestId: string) => {
    setIsLoading(true);
    try {
      await checkInGuest(eventId, guestId);

      setGuests(prevGuests => {
        return prevGuests.map(guest => {
          if (guest.id === guestId) {
            return {
              ...guest,
              checked_in: !guest.checked_in,
              check_in_time: guest.checked_in ? null : new Date().toISOString()
            };
          }
          return guest;
        });
      });

      setFilteredGuests(prevFilteredGuests => {
        return prevFilteredGuests.map(guest => {
          if (guest.id === guestId) {
            return {
              ...guest,
              checked_in: !guest.checked_in,
              check_in_time: guest.checked_in ? null : new Date().toISOString()
            };
          }
          return guest;
        });
      });
    } catch (error) {
      console.error('Error checking in guest:', error);
      toast.error('Failed to check in guest');
    } finally {
      setIsLoading(false);
    }
  };

  const notCheckedInGuests = filteredGuests.filter(guest => !guest.checked_in && !guest.rejected);
  const checkedInGuests = filteredGuests.filter(guest => guest.checked_in && !guest.rejected);
  const rejectedGuests = filteredGuests.filter(guest => guest.rejected);

  const isAdminOrPromoter = profile?.role === 'admin' || profile?.role === 'promoter';

  const handleOpenModal = (guest: Guest) => {
    
    setSelectedGuest(guest);
    setIsModalOpen(true);
  };

  const handleContextMenu = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>, guest: Guest) => {
    e.preventDefault();
    handleOpenModal(guest);
  };

  const handleTouchStart = (e: React.TouchEvent<HTMLButtonElement>, guest: Guest) => {
    const timer = setTimeout(() => {
      handleOpenModal(guest);
    }, 700);

    const clearTimer = () => clearTimeout(timer);
    e.currentTarget.addEventListener('touchend', clearTimer, { once: true });
    e.currentTarget.addEventListener('touchmove', clearTimer, { once: true });
  };

  const handleLegendClick = (sectionId: string, setOpen: React.Dispatch<React.SetStateAction<boolean>>, isOpen: boolean) => {
    const sectionElement = document.getElementById(sectionId);
    if (!isOpen) {
      setOpen(true);
      setTimeout(() => {
        sectionElement?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 0);
    } else {
      sectionElement?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const toggleSection = (setOpen: React.Dispatch<React.SetStateAction<boolean>>) => {
    setOpen(prev => !prev);
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-3 gap-4 mb-6">
        <button
          onClick={() => handleLegendClick('not-checked-in-section', setIsNotCheckedInOpen, isNotCheckedInOpen)}
          className="bg-[#2a2d35] rounded-lg p-4 text-left hover:bg-[#3a3d45] transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <div className="text-sm text-gray-400">Not Checked In</div>
          <div className="text-2xl font-bold text-white">{notCheckedInGuests.length}</div>
        </button>
        <button
          onClick={() => handleLegendClick('checked-in-section', setIsCheckedInOpen, isCheckedInOpen)}
          className="bg-[#2a2d35] rounded-lg p-4 text-left hover:bg-[#3a3d45] transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <div className="text-sm text-gray-400">Checked In</div>
          <div className="text-2xl font-bold text-white">{checkedInGuests.length}</div>
        </button>
        <button
          onClick={() => handleLegendClick('rejected-section', setIsRejectedOpen, isRejectedOpen)}
          className="bg-[#2a2d35] rounded-lg p-4 text-left hover:bg-[#3a3d45] transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <div className="text-sm text-gray-400">Rejected</div>
          <div className="text-2xl font-bold text-white">{rejectedGuests.length}</div>
        </button>
      </div>

      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-white">Guest List</h2>
        {isAdminOrPromoter && (
          <div className="flex items-center space-x-2">
            <button
              onClick={() => { setSelectedGuest(null); setIsModalOpen(true); }}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Add Guest
            </button>
            <CSVImportButton eventId={eventId} />
          </div>
        )}
      </div>

      <div id="not-checked-in-section">
        <h3
          className="text-xl font-semibold text-gray-300 mb-4 cursor-pointer flex justify-between items-center"
          onClick={() => toggleSection(setIsNotCheckedInOpen)}
        >
          Not Checked In
          <span className={`transform transition-transform duration-200 ${isNotCheckedInOpen ? 'rotate-180' : 'rotate-0'}`}>
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </span>
        </h3>
        {isNotCheckedInOpen && notCheckedInGuests.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {notCheckedInGuests.map((guest) => (
              <button
                key={`guest-${guest.id}`}
                onClick={() => handleCheckIn(guest.id)}
                onContextMenu={(e) => handleContextMenu(e, guest)}
                onTouchStart={(e) => handleTouchStart(e, guest)}
                disabled={isLoading}
                className={`w-full text-left bg-[#2a2d35] rounded-lg p-6 shadow-lg hover:shadow-xl transition-all hover:bg-green-500/10 disabled:opacity-50 disabled:cursor-not-allowed`}
              >
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-lg font-semibold text-white mb-2">{guest.full_name}</h3>
                    <div className="space-y-1">
                      {guest.email && (
                        <div className="flex items-center text-sm">
                          <svg className="w-4 h-4 text-gray-400 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
                          <span className="text-gray-400 truncate" title={guest.email}>{guest.email}</span>
                        </div>
                      )}
                      {guest.phone && (
                        <div className="flex items-center text-sm">
                          <svg className="w-4 h-4 text-gray-400 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" /></svg>
                          <span className="text-gray-400 truncate" title={guest.phone}>{guest.phone}</span>
                        </div>
                      )}
                      {guest.instagram && (
                        <div className="flex items-center text-sm">
                          <svg className="w-4 h-4 text-gray-400 mr-2 flex-shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line></svg>
                          <span className="text-gray-400 truncate" title={guest.instagram}>{guest.instagram}</span>
                        </div>
                      )}
                      <div className="flex items-center text-sm pt-1">
                        <svg className="w-4 h-4 text-gray-400 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                        <span className="text-gray-400">Added: {new Date(guest.added_at).toLocaleDateString()} by {guest.added_by || 'Unknown'}</span>
                      </div>
                      {guest.note && (
                        <div className="mt-2 p-2 bg-gray-700/50 rounded">
                          <p className="text-gray-300 text-xs italic line-clamp-2">Note: {guest.note}</p>
                        </div>
                      )}
                    </div>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-xs font-medium bg-yellow-500/20 text-yellow-400 flex-shrink-0 self-start`}>
                    Pending
                  </span>
                </div>
              </button>
            ))}
          </div>
        )}
        {isNotCheckedInOpen && notCheckedInGuests.length === 0 && (
          <p className="text-gray-500 italic text-sm pl-2">No guests pending check-in.</p>
        )}
      </div>

      <div id="checked-in-section">
        <h3
          className="text-xl font-semibold text-gray-300 mb-4 cursor-pointer flex justify-between items-center"
          onClick={() => toggleSection(setIsCheckedInOpen)}
        >
          Checked In
          <span className={`transform transition-transform duration-200 ${isCheckedInOpen ? 'rotate-180' : 'rotate-0'}`}>
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </span>
        </h3>
        {isCheckedInOpen && checkedInGuests.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {checkedInGuests.map((guest) => (
              <button
                key={`guest-${guest.id}`}
                onClick={() => handleCheckIn(guest.id)}
                onContextMenu={(e) => handleContextMenu(e, guest)}
                onTouchStart={(e) => handleTouchStart(e, guest)}
                disabled={isLoading}
                className={`w-full text-left bg-[#2a2d35] rounded-lg p-6 shadow-lg hover:shadow-xl transition-all hover:bg-red-500/10 disabled:opacity-50 disabled:cursor-not-allowed`}
              >
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-lg font-semibold text-white mb-2">{guest.full_name}</h3>
                    <div className="space-y-1">
                      {guest.email && (
                        <div className="flex items-center text-sm">
                          <svg className="w-4 h-4 text-gray-400 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
                          <span className="text-gray-400 truncate" title={guest.email}>{guest.email}</span>
                        </div>
                      )}
                      {guest.phone && (
                        <div className="flex items-center text-sm">
                          <svg className="w-4 h-4 text-gray-400 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" /></svg>
                          <span className="text-gray-400 truncate" title={guest.phone}>{guest.phone}</span>
                        </div>
                      )}
                      {guest.instagram && (
                        <div className="flex items-center text-sm">
                          <svg className="w-4 h-4 text-gray-400 mr-2 flex-shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line></svg>
                          <span className="text-gray-400 truncate" title={guest.instagram}>{guest.instagram}</span>
                        </div>
                      )}
                      <div className="flex items-center text-sm pt-1">
                        <svg className="w-4 h-4 text-gray-400 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                        <span className="text-gray-400">Checked In: {guest.check_in_time ? new Date(guest.check_in_time).toLocaleTimeString() : 'N/A'}</span>
                      </div>
                      {guest.note && (
                        <div className="mt-2 p-2 bg-gray-700/50 rounded">
                          <p className="text-gray-300 text-xs italic line-clamp-2">Note: {guest.note}</p>
                        </div>
                      )}
                    </div>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-xs font-medium bg-green-500/20 text-green-400 flex-shrink-0 self-start`}>
                    Checked In
                  </span>
                </div>
              </button>
            ))}
          </div>
        )}
        {isCheckedInOpen && checkedInGuests.length === 0 && (
          <p className="text-gray-500 italic text-sm pl-2">No guests checked in yet.</p>
        )}
      </div>

      <div id="rejected-section">
        <h3
          className="text-xl font-semibold text-gray-300 mb-4 cursor-pointer flex justify-between items-center"
          onClick={() => toggleSection(setIsRejectedOpen)}
        >
          Rejected
          <span className={`transform transition-transform duration-200 ${isRejectedOpen ? 'rotate-180' : 'rotate-0'}`}>
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </span>
        </h3>
        {isRejectedOpen && rejectedGuests.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {rejectedGuests.map((guest) => (
              <button
                key={`guest-${guest.id}`}
                onContextMenu={(e) => handleContextMenu(e, guest)}
                onTouchStart={(e) => handleTouchStart(e, guest)}
                onClick={() => handleOpenModal(guest)}
                disabled={isLoading}
                className={`w-full text-left bg-[#2a2d35] rounded-lg p-6 shadow-lg hover:shadow-xl transition-all hover:bg-[#3a3d45]/80 disabled:opacity-50 disabled:cursor-not-allowed opacity-70`}
              >
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-lg font-semibold text-white mb-2 line-through">{guest.full_name}</h3>
                    <div className="space-y-1">
                      {guest.email && (
                        <div className="flex items-center text-sm">
                          <svg className="w-4 h-4 text-gray-400 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
                          <span className="text-gray-400 truncate" title={guest.email}>{guest.email}</span>
                        </div>
                      )}
                      {guest.phone && (
                        <div className="flex items-center text-sm">
                          <svg className="w-4 h-4 text-gray-400 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" /></svg>
                          <span className="text-gray-400 truncate" title={guest.phone}>{guest.phone}</span>
                        </div>
                      )}
                      {guest.note && (
                        <div className="mt-2 p-2 bg-red-900/30 rounded">
                          <p className="text-red-400 text-xs italic">Reason: {guest.note}</p>
                        </div>
                      )}
                    </div>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-xs font-medium bg-red-500/20 text-red-400 flex-shrink-0 self-start`}>
                    Rejected
                  </span>
                </div>
              </button>
            ))}
          </div>
        )}
        {isRejectedOpen && rejectedGuests.length === 0 && (
          <p className="text-gray-500 italic text-sm pl-2">No guests have been rejected.</p>
        )}
      </div>

      {filteredGuests.length === 0 && !isLoading && (
        <div className="text-center py-12">
          <p className="text-gray-400 text-lg">No matching guests found</p>
        </div>
      )}
      <ToastContainer
        position="bottom-right"
      />
      <GuestModal
        isOpen={isModalOpen}
        onClose={() => { setIsModalOpen(false); setSelectedGuest(null); }}
        eventId={eventId}
        guest={selectedGuest}
        onSuccess={(updatedGuest: Guest, type: string) => {
          // Create state update function for both guests and filteredGuests
          const updateBothGuestLists = (updateFn: (prevGuests: Guest[]) => Guest[]) => {
            setGuests(updateFn);
            setFilteredGuests(updateFn);
          };

          switch (type) {
            case 'update':
              updateBothGuestLists(prevGuests => 
                prevGuests.map(guest => 
                  guest.id === updatedGuest.id ? updatedGuest : guest
                )
              );
              break;

            case 'add':
              updateBothGuestLists(prevGuests => [...prevGuests, updatedGuest]);
              break;

            case 'delete':
              updateBothGuestLists(prevGuests => 
                prevGuests.filter(guest => guest.id !== updatedGuest.id)
              );
              break;

            default:
              console.warn('Unknown operation type:', type);
          }

          // Refresh search if there's an active search query
          const searchInput = document.getElementById(searchInputId) as HTMLInputElement;
          if (searchInput?.value) {
            searchInput.dispatchEvent(new Event('input', { bubbles: true }));
          }
          
          setIsModalOpen(false);
          setSelectedGuest(null);
        }}
      />
    </div>
  );
}