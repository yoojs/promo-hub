'use client';

import { useState } from 'react';
import { createClient } from '@/utils/supabase/client';

export function ContactForm() {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus('idle');

    try {
      const supabase = createClient();
      
      const { error } = await supabase
        .from('contact_messages')
        .insert([
          {
            name: formData.name,
            phone: formData.phone,
            message: formData.message,
            status: 'new'
          }
        ]);

      if (error) throw error;

      setSubmitStatus('success');
      setFormData({ name: '', phone: '', message: '' });
    } catch (error) {
      console.error('Error submitting form:', error);
      setSubmitStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-2xl mx-auto">
      <div className="space-y-4">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-300">
            Name
          </label>
          <input
            type="text"
            id="name"
            required
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            className="mt-1 block w-full rounded bg-[#262b36] border-gray-700 text-white placeholder-gray-400 focus:border-blue-500 focus:ring-blue-500 text-sm"
          />
        </div>

        <div>
          <label htmlFor="phone" className="block text-sm font-medium text-gray-300">
            Phone Number
          </label>
          <input
            type="tel"
            id="phone"
            required
            value={formData.phone}
            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
            className="mt-1 block w-full rounded bg-[#262b36] border-gray-700 text-white placeholder-gray-400 focus:border-blue-500 focus:ring-blue-500 text-sm"
          />
        </div>

        <div>
          <label htmlFor="message" className="block text-sm font-medium text-gray-300">
            Message
          </label>
          <textarea
            id="message"
            required
            rows={4}
            value={formData.message}
            onChange={(e) => setFormData({ ...formData, message: e.target.value })}
            placeholder="Message me for guestlist! Send me any social media, and number of people in party, and package you're interested in!"
            className="mt-1 block w-full rounded bg-[#262b36] border-gray-700 text-white placeholder-gray-400 focus:border-blue-500 focus:ring-blue-500 text-sm"
          />
        </div>

        <div>
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
          >
            {isSubmitting ? 'Sending...' : 'Send Message'}
          </button>
        </div>

        {submitStatus === 'success' && (
          <p className="text-green-400 text-center text-sm">Message sent successfully!</p>
        )}
        {submitStatus === 'error' && (
          <p className="text-red-400 text-center text-sm">Error sending message. Please try again.</p>
        )}
      </div>
    </form>
  );
} 