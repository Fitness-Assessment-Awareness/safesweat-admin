import { createClient } from '@supabase/supabase-js';
import { v4 as uuid } from 'uuid';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
export const supabase = createClient(supabaseUrl, supabaseKey);

export const uploadFileToBucket = async (bucketName: string, file: File) => {
    const { data } = await supabase.storage.from(bucketName).upload(`${uuid()}`, file, {
        cacheControl: '3600',
        upsert: false,
    });
    if (!data) {
        return null;
    }
    const { data: uploadedUrl } = supabase.storage.from(bucketName).getPublicUrl(data.path);
    return uploadedUrl.publicUrl;
};

export const deleteFileInBucket = async (bucketName: string, path: string) => {
    await supabase.storage.from(bucketName).remove([path]);
};
