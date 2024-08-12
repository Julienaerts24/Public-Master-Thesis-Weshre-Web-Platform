import { createClient, SupabaseClient } from '@supabase/supabase-js'

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

const supabase: SupabaseClient = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
const bucketName = process.env.NEXT_PUBLIC_SUPABASE_BUCKET_NAME!;

export async function uploadImageSupabaseFromBlobUrl(blobUrl: string, storagePath: string): Promise<string> {
    try {
        const response = await fetch(blobUrl);
        const blob = await response.blob();
        const buffer = await blob.arrayBuffer();

        const { data: _, error } = await supabase.storage
            .from(bucketName)
            .upload(storagePath, buffer, {
                contentType: "image/jpg",
                cacheControl: 'no-cache, no-store, must-revalidate',
                upsert: true,
            });

        if (error) {
            console.error("Error uploading image to Supabase: ", error);
            throw error;
        }

        const {data: url} = supabase.storage
          .from(bucketName)
          .getPublicUrl(storagePath);

        const cacheBustingUrl = `${url.publicUrl}?update=${new Date().getTime()}`;
        return cacheBustingUrl;
    } catch (error) {
        console.error("Error processing image upload:", error);
        throw error;
    }
}

export async function getBlobFromSupabaseUrl(supabaseURL: string): Promise<string> {
    try {
        const response = await fetch(supabaseURL);
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const blob = await response.blob();
        return URL.createObjectURL(blob);
    } catch (error) {
        console.error("Error retrieving image as blob URL:", error);
        throw error;
    }
}

export async function deleteAllEventPhotos(eventId: string): Promise<void> {
    try {
        const { data: files, error: listError } = await supabase.storage
            .from(bucketName)
            .list(`events/${eventId}`, {
                limit: 100,
                offset: 0,
            });

        if (listError) {
            console.error("Error listing images:", listError);
            throw new Error("Failed to list event images: " + listError.message);
        }

        if (!files || files.length === 0) {
            return;
        }

        const deletePromises = files.map(file => {
            const path = `events/${eventId}/${file.name}`;
            return supabase.storage
                .from(bucketName)
                .remove([path]);
        });

        const results = await Promise.all(deletePromises);

        results.forEach((result, index) => {
            if (result.error) {
                console.error(`Error deleting file ${files[index].name}:`, result.error);
                throw new Error(`Failed to delete file ${files[index].name}: ` + result.error.message);
            }
        });
    } catch (error) {
        console.error("Error deleting event photos:", error);
        throw error;
    }
}

