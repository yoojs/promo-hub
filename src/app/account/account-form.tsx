'use client'

import { useCallback, useEffect, useState } from 'react'
import { User } from '@supabase/supabase-js'
import { createClient } from '@/utils/supabase/client'
import { useRouter } from 'next/navigation'
import { PostgrestError } from '@supabase/supabase-js'
import { Avatar } from '@/components/ui/avatar'

export default function AccountForm({ user }: { user: User }) {
  const supabase = createClient()
  const [loading, setLoading] = useState(true)
  const [fullName, setFullName] = useState<string | null>(null)
  const [username, setUsername] = useState<string | null>(null)
  const [website, setWebsite] = useState<string | null>(null)
  const [avatar_url, setAvatarUrl] = useState<string | null>(null)
  const [description, setDescription] = useState<string | null>(null)
  const [socialMedia, setSocialMedia] = useState<{
    instagram?: string
    twitter?: string
    facebook?: string
    tiktok?: string
  }>({})
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  const getProfile = useCallback(async () => {
    try {
      setLoading(true)

      const { data, error } = await supabase
        .from('profiles')
        .select(`full_name, username, website, avatar_url, description, social_media`)
        .eq('id', user.id)
        .single()

      if (error) {
        throw error
      }

      if (data) {
        setFullName(data.full_name)
        setUsername(data.username)
        setWebsite(data.website)
        setAvatarUrl(data.avatar_url)
        setDescription(data.description)
        setSocialMedia(data.social_media || {})
      }
    } catch (error) {
      if (error instanceof PostgrestError) {
        setError(error.message)
      } else {
        setError('Error loading user data')
      }
    } finally {
      setLoading(false)
    }
  }, [user, supabase])

  useEffect(() => {
    getProfile()
  }, [getProfile])

  async function updateProfile({
    username,
    website,
    avatar_url,
    description,
    social_media,
  }: {
    username: string | null
    website: string | null
    avatar_url: string | null
    description: string | null
    social_media: {
      instagram?: string
      twitter?: string
      facebook?: string
      tiktok?: string
    }
  }) {
    try {
      setLoading(true)

      const { error } = await supabase.from('profiles').upsert({
        id: user?.id,
        full_name: fullName,
        username,
        website,
        avatar_url,
        description,
        social_media,
        updated_at: new Date().toISOString(),
      })

      if (error) throw error
      setError(null)
      alert('Profile updated!')
      router.refresh()
    } catch (error) {
      if (error instanceof PostgrestError) {
        setError(error.message)
      } else {
        setError('Error updating the data!')
      }
    } finally {
      setLoading(false)
    }
  }

  const handleAvatarUpload = async (url: string) => {
    setAvatarUrl(url)
    await updateProfile({ username, website, avatar_url: url, description, social_media: socialMedia })
  }

  return (
    <div className="flex flex-col items-center">
      <div className="flex w-full max-w-md flex-col gap-4">
        <h1 className="text-4xl font-bold text-white">Account</h1>
        <form
          onSubmit={(e) => {
            e.preventDefault()
            updateProfile({ username, website, avatar_url, description, social_media: socialMedia })
          }}
          className="space-y-6"
        >
          <Avatar
            uid={user?.id ?? null}
            url={avatar_url}
            size={150}
            onUpload={handleAvatarUpload}
          />
          <div className="space-y-2">
            <label htmlFor="email" className="block text-sm font-medium text-gray-300">
              Email
            </label>
            <input
              id="email"
              type="text"
              value={user?.email}
              disabled
              className="mt-1 block w-full rounded-md px-4 py-3 bg-[#1e222a]/90 border-white/10 text-white placeholder-gray-400 focus:border-blue-500 focus:ring-blue-500 text-base disabled:opacity-50"
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="fullName" className="block text-sm font-medium text-gray-300">
              Full Name
            </label>
            <input
              id="fullName"
              type="text"
              value={fullName || ''}
              onChange={(e) => setFullName(e.target.value)}
              className="mt-1 block w-full rounded-md px-4 py-3 bg-[#1e222a]/90 border-white/10 text-white placeholder-gray-400 focus:border-blue-500 focus:ring-blue-500 text-base"
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="username" className="block text-sm font-medium text-gray-300">
              Username
            </label>
            <input
              id="username"
              type="text"
              value={username || ''}
              onChange={(e) => setUsername(e.target.value)}
              className="mt-1 block w-full rounded-md px-4 py-3 bg-[#1e222a]/90 border-white/10 text-white placeholder-gray-400 focus:border-blue-500 focus:ring-blue-500 text-base"
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="website" className="block text-sm font-medium text-gray-300">
              Website
            </label>
            <input
              id="website"
              type="url"
              value={website || ''}
              onChange={(e) => setWebsite(e.target.value)}
              className="mt-1 block w-full rounded-md px-4 py-3 bg-[#1e222a]/90 border-white/10 text-white placeholder-gray-400 focus:border-blue-500 focus:ring-blue-500 text-base"
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="description" className="block text-sm font-medium text-gray-300">
              Description
            </label>
            <textarea
              id="description"
              value={description || ''}
              onChange={(e) => setDescription(e.target.value)}
              rows={4}
              className="mt-1 block w-full rounded-md px-4 py-3 bg-[#1e222a]/90 border-white/10 text-white placeholder-gray-400 focus:border-blue-500 focus:ring-blue-500 text-base"
            />
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-medium text-white">Social Media</h3>
            <div className="space-y-2">
              <label htmlFor="instagram" className="block text-sm font-medium text-gray-300">
                Instagram
              </label>
              <input
                id="instagram"
                type="text"
                value={socialMedia.instagram || ''}
                onChange={(e) => setSocialMedia({ ...socialMedia, instagram: e.target.value })}
                className="mt-1 block w-full rounded-md px-4 py-3 bg-[#1e222a]/90 border-white/10 text-white placeholder-gray-400 focus:border-blue-500 focus:ring-blue-500 text-base"
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="twitter" className="block text-sm font-medium text-gray-300">
                Twitter
              </label>
              <input
                id="twitter"
                type="text"
                value={socialMedia.twitter || ''}
                onChange={(e) => setSocialMedia({ ...socialMedia, twitter: e.target.value })}
                className="mt-1 block w-full rounded-md px-4 py-3 bg-[#1e222a]/90 border-white/10 text-white placeholder-gray-400 focus:border-blue-500 focus:ring-blue-500 text-base"
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="facebook" className="block text-sm font-medium text-gray-300">
                Facebook
              </label>
              <input
                id="facebook"
                type="text"
                value={socialMedia.facebook || ''}
                onChange={(e) => setSocialMedia({ ...socialMedia, facebook: e.target.value })}
                className="mt-1 block w-full rounded-md px-4 py-3 bg-[#1e222a]/90 border-white/10 text-white placeholder-gray-400 focus:border-blue-500 focus:ring-blue-500 text-base"
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="tiktok" className="block text-sm font-medium text-gray-300">
                TikTok
              </label>
              <input
                id="tiktok"
                type="text"
                value={socialMedia.tiktok || ''}
                onChange={(e) => setSocialMedia({ ...socialMedia, tiktok: e.target.value })}
                className="mt-1 block w-full rounded-md px-4 py-3 bg-[#1e222a]/90 border-white/10 text-white placeholder-gray-400 focus:border-blue-500 focus:ring-blue-500 text-base"
              />
            </div>
          </div>

          {error && (
            <div className="text-red-400 text-sm text-center bg-red-500/10 py-2 rounded-md">
              {error}
            </div>
          )}

          <div className="flex justify-end space-x-4">
            <button
              type="submit"
              disabled={loading}
              className="flex justify-center py-3 px-6 border border-transparent rounded-md text-base font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 transition-colors"
            >
              {loading ? 'Saving...' : 'Update Profile'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
} 