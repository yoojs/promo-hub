'use client';

import { useState } from 'react';
import { addToWaitlist } from './actions';
import { WaitlistRole } from '@/types/waitlist';
import { ToastContainer, toast } from 'react-toastify';
import Link from 'next/link';

export default function WaitlistPage() {
  const [formData, setFormData] = useState({
    full_name: '',
    email: '',
    role: 'user' as WaitlistRole
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      await addToWaitlist(formData);
      toast.success('Successfully joined the waitlist!');
      setFormData({ full_name: '', email: '', role: 'user' }); // Reset form
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to join waitlist');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#1a1d24] flex items-center justify-center px-4">
      <div className="bg-[#262b36] p-8 rounded-lg shadow-xl w-full max-w-md">
        <Link 
          href="/login"
          className="text-gray-400 hover:text-white transition-colors mb-6 inline-block"
        >
          ← Back to Login
        </Link>

        <h1 className="text-2xl font-bold text-white mb-2">Join our Waitlist</h1>
        <p className="text-gray-400 mb-6">
          Sign up to be notified when we launch new features and open registration.
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="full_name" className="block text-sm font-medium text-gray-300 mb-1">
              Full Name
            </label>
            <input
              id="full_name"
              type="text"
              required
              value={formData.full_name}
              onChange={e => setFormData(prev => ({ ...prev, full_name: e.target.value }))}
              className="w-full px-3 py-2 bg-[#1e222a] border border-gray-700 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-1">
              Email
            </label>
            <input
              id="email"
              type="email"
              required
              value={formData.email}
              onChange={e => setFormData(prev => ({ ...prev, email: e.target.value }))}
              className="w-full px-3 py-2 bg-[#1e222a] border border-gray-700 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label htmlFor="role" className="block text-sm font-medium text-gray-300 mb-1">
              I am a...
            </label>
            <select
              id="role"
              required
              value={formData.role}
              onChange={e => setFormData(prev => ({ ...prev, role: e.target.value as WaitlistRole }))}
              className="w-full px-3 py-2 bg-[#1e222a] border border-gray-700 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="user">User</option>
              <option value="promoter">Promoter</option>
              <option value="venue">Venue Owner/Manager</option>
            </select>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
          >
            {isSubmitting ? 'Joining...' : 'Join Waitlist'}
          </button>
        </form>
      </div>
    <ToastContainer position="bottom-right"/>
    </div>
  );
}