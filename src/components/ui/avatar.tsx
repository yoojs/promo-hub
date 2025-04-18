import { useState } from 'react'
import { createClient } from '@/utils/supabase/client'
import Image from 'next/image'
interface AvatarProps {
  uid: string | null
  url: string | null
  size: number
  onUpload: (url: string) => void
}

export function Avatar({ uid, url, size, onUpload }: AvatarProps) {
  const [uploading, setUploading] = useState(false)
  const supabase = createClient()

  const uploadAvatar = async (event: React.ChangeEvent<HTMLInputElement>) => {
    try {
      setUploading(true)

      if (!event.target.files || event.target.files.length === 0) {
        throw new Error('You must select an image to upload.')
      }

      const file = event.target.files[0]
      const fileExt = file.name.split('.').pop()
      const filePath = `${uid}-${Math.random()}.${fileExt}`

      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(filePath, file)

      if (uploadError) {
        throw uploadError
      }

      // Get the public URL for the uploaded file
      const { data: { publicUrl } } = supabase.storage
        .from('avatars')
        .getPublicUrl(filePath)

      onUpload(publicUrl)
    } catch (error) {
      alert(`Error uploading avatar: ${error instanceof Error ? error.message : 'Unknown error'}`)
    } finally {
      setUploading(false)
    }
  }

  return (
    <div className="flex flex-col items-center">
      <div className="relative">
        <Image
          src={url || `https://api.dicebear.com/7.x/avataaars/svg?seed=${uid}`}
          alt="Avatar"
          className="rounded-full"
          width={size}
          height={size}
        />
        <label
          htmlFor="single"
          className="absolute bottom-0 right-0 bg-blue-500 p-2 rounded-full cursor-pointer hover:bg-blue-600 transition-colors"
        >
          <input
            type="file"
            id="single"
            accept="image/*"
            onChange={uploadAvatar}
            disabled={uploading}
            className="hidden"
          />
          {uploading ? 'Uploading...' : 'Upload'}
        </label>
      </div>
    </div>
  )
} 