'use client';

import { useState } from 'react';
import { AdditionalGuest } from '@/types/events';

interface AdditionalGuestModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (guest: AdditionalGuest) => void;
}


export function AdditionalGuestModal({ isOpen, onClose, onAdd }: AdditionalGuestModalProps) {
  const [formData, setFormData] = useState<AdditionalGuest>({
    full_name: '',
    email: '',
    phone: '',
    instagram: ''
  });

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onAdd(formData);
    setFormData({ full_name: '', email: '', phone: '', instagram: '' }); // Reset form
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-[#262b36] rounded-xl p-6 w-full max-w-md">
        <h2 className="text-2xl font-bold text-white mb-4">Add Additional Guest</h2>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="full_name" className="block text-sm font-medium text-gray-300 mb-1">
              Full Name <span className="text-red-400">*</span>
            </label>
            <input
              type="text"
              id="full_name"
              required
              value={formData.full_name}
              onChange={e => setFormData(prev => ({ ...prev, full_name: e.target.value }))}
              className="w-full px-3 py-2 bg-[#1e222a] border border-gray-700 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label htmlFor="phone" className="block text-sm font-medium text-gray-300 mb-1">
              Phone
            </label>
            <input
              type="tel"
              id="phone"
              required
              value={formData.phone}
              onChange={e => setFormData(prev => ({ ...prev, phone: e.target.value }))}
              className="w-full px-3 py-2 bg-[#1e222a] border border-gray-700 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-1">
              Email (Optional)
            </label>
            <input
              type="email"
              id="email"
              value={formData.email}
              onChange={e => setFormData(prev => ({ ...prev, email: e.target.value }))}
              className="w-full px-3 py-2 bg-[#1e222a] border border-gray-700 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label htmlFor="instagram" className="block text-sm font-medium text-gray-300 mb-1">
              Instagram (Optional)
            </label>
            <input
              type="text"
              id="instagram"
              value={formData.instagram}
              onChange={e => setFormData(prev => ({ ...prev, instagram: e.target.value }))}
              className="w-full px-3 py-2 bg-[#1e222a] border border-gray-700 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="flex justify-end space-x-4 mt-6">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-300 hover:text-white transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Add Guest
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}