'use client';

import Link from 'next/link';
import { useState } from 'react';
import { usePathname } from 'next/navigation';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { useRouter } from 'next/navigation';
import { useProfile } from '@/hooks/use-profile'; // Assuming you have this hook

// Simple Hamburger Icon Component
const HamburgerIcon = ({ open }: { open: boolean }) => (
  <svg
    className="w-6 h-6 text-gray-300"
    fill="none"
    strokeLinecap="round"
    strokeLinejoin="round"
    strokeWidth="2"
    viewBox="0 0 24 24"
    stroke="currentColor"
  >
    {open ? (
      <path d="M6 18L18 6M6 6l12 12"></path> // X icon
    ) : (
      <path d="M4 6h16M4 12h16m-7 6h7"></path> // Hamburger icon
    )}
  </svg>
);

export function Navigation() {
  const pathname = usePathname();
  const router = useRouter();
  const supabase = createClientComponentClient();
  const { data: profile, isLoading: profileLoading } = useProfile(); // Get profile data

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  // const isActive = (path: string) => pathname === path

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.push('/login'); // Redirect to login after sign out
    setIsMobileMenuOpen(false); // Close menu on sign out
  };
  const handleSignIn = async () => {
    router.push('/login'); // Redirect to login after sign out
    setIsMobileMenuOpen(false); // Close menu on sign out
  }
  const navItems = [
    { href: '/promoters', label: 'Promoters' },
    { href: '/venues', label: 'Venues' },
    // Add other common links here
  ];

  // Conditional links based on role
  if (profile?.role === 'admin' || profile?.role === 'promoter') {
    navItems.push({ href: '/events', label: 'Events' });
    navItems.push({ href: '/guestlists', label: 'Guest lists' });
    navItems.push({ href: '/account', label: 'Account' });
  }
  if (profile?.role === 'admin') {
    navItems.push({ href: '/admin', label: 'Admin' });
  }

  const NavLink = ({ href, label }: { href: string; label: string }) => (
    <Link
      href={href}
      onClick={() => setIsMobileMenuOpen(false)} // Close menu on link click
      className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
        pathname === href
          ? 'text-white border-b-2 border-blue-500'
          : 'text-gray-300 hover:text-white hover:bg-white/5'
      }`}
    >
      {label}
    </Link>
  );

  return (
    <nav className="bg-[#2a2d35] shadow-md sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo/Brand */}
          <div className="flex-shrink-0">
            <Link href="/" className="text-white font-bold text-xl">
              PromoHub {/* Or your logo component */}
            </Link>
          </div>

          {/* Desktop Navigation Links (Hidden on Mobile) */}
          <div className="hidden lg:block">
            <div className="ml-10 flex items-baseline space-x-4">
              {navItems.map((item) => (
                <NavLink key={item.href} href={item.href} label={item.label} />
              ))}
              {/* Desktop Account/Sign Out */}
              <div className="ml-4 relative">
                 {/* You might want a dropdown here for account settings */}
                 {profile && <button
                    onClick={handleSignOut}
                    className="px-3 py-2 rounded-md text-sm font-medium text-gray-300 hover:bg-gray-700 hover:text-white"
                 >
                    Sign Out
                 </button>}
                 {!profile && 
                  <button
                    onClick={handleSignIn}
                    className="px-3 py-2 rounded-md text-sm font-medium text-gray-300 hover:bg-gray-700 hover:text-white"
                  >
                    Login
                  </button>
                 }
              </div>
            </div>
          </div>

          {/* Mobile Menu Button (Visible on Mobile) */}
          <div className="lg:hidden flex items-center">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-white hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
              aria-controls="mobile-menu"
              aria-expanded={isMobileMenuOpen}
            >
              <span className="sr-only">Open main menu</span>
              <HamburgerIcon open={isMobileMenuOpen} />
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu (Dropdown) */}
      {/* Use transition classes for smooth opening/closing */}
      <div
        className={`lg:hidden transition-all duration-300 ease-in-out overflow-hidden ${
          isMobileMenuOpen ? 'max-h-screen border-t border-gray-700' : 'max-h-0'
        }`}
        id="mobile-menu"
      >
        <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setIsMobileMenuOpen(false)} // Close menu on link click
              className={`block px-3 py-2 rounded-md text-base font-medium transition-colors ${
                pathname === item.href
                  ? 'bg-gray-900 text-white'
                  : 'text-gray-300 hover:bg-gray-700 hover:text-white'
              }`}
            >
              {item.label}
            </Link>
          ))}
          {/* Mobile Account/Sign Out */}
          <div className="pt-4 pb-3 border-t border-gray-700">
             {/* Display user info if available */}
             {profile && !profileLoading && (
                <div className="flex items-center px-5 mb-3">
                   <div className="ml-3">
                      <div className="text-base font-medium leading-none text-white">{profile.full_name || 'User'}</div>
                   </div>
                </div>
             )}
             <div className="mt-3 px-2 space-y-1">
                {/* Add mobile-specific account links if needed */}
                {/* <Link href="/account" ...>Your Profile</Link> */}
                {profile && <button
                    onClick={handleSignOut}
                    className="px-3 py-2 rounded-md text-sm font-medium text-gray-300 hover:bg-gray-700 hover:text-white"
                 >
                    Sign Out
                 </button>}
                 {!profile && 
                  <button
                    onClick={handleSignIn}
                    className="px-3 py-2 rounded-md text-sm font-medium text-gray-300 hover:bg-gray-700 hover:text-white"
                  >
                    Login
                  </button>
                 }
             </div>
          </div>
        </div>
      </div>
    </nav>
  );
}