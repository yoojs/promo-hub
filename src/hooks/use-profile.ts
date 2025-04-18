import { useState, useEffect } from 'react';
import { createClient } from '@/utils/supabase/client';
import { PostgrestError } from '@supabase/supabase-js';

export const useProfile = () => {
  interface Profile {
    id: string;
    full_name: string;
    role: string;
  }

  const [data, setData] = useState<Profile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<PostgrestError | null>(null);

  useEffect(() => {
    const fetchProfile = async () => {
      const supabase = createClient();
      try {
        const { data: { user } } = await supabase.auth.getUser();

        if (user) {
          const { data: profileData, error: profileError } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', user.id)
            .single();

          if (profileError) {
            setError(profileError);
          } else {
            setData(profileData);
          }
        }
      } catch (err: unknown) {
        if (err instanceof Error) {
          setError(err as PostgrestError);
        } else {
          setError({ message: 'An unknown error occurred' } as PostgrestError);
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchProfile();
  }, []);

  return { data, isLoading, error };
};