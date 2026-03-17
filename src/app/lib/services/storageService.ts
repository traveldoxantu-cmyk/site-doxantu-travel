import { supabase } from '../supabase';

export const storageService = {
  /**
   * Upload a file to a specific bucket
   */
  uploadFile: async (bucket: string, path: string, file: File) => {
    if (!supabase) throw new Error('Supabase client not initialized');
    
    const { data, error } = await supabase.storage
      .from(bucket)
      .upload(path, file, {
        upsert: true,
        cacheControl: '3600',
      });

    if (error) throw error;
    
    const { data: { publicUrl } } = supabase.storage
      .from(bucket)
      .getPublicUrl(data.path);

    return publicUrl;
  },

  /**
   * Delete a file from a bucket
   */
  deleteFile: async (bucket: string, path: string) => {
    if (!supabase) throw new Error('Supabase client not initialized');

    const { error } = await supabase.storage
      .from(bucket)
      .remove([path]);
    
    if (error) throw error;
  }
};
