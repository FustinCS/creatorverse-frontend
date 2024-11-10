import supabase from "@/supabase/client";

export const getUserCommunities = async (userId: string) => {
    const { data, error } = await supabase
        .from('Users_Communities')
        .select(`
            communityId,
            Community (
                name
            )
        `)
        .eq('userId', userId);

    if (error) throw error;
    return data;
}

export interface Art {
    id: string;
    publicUrl: string;
    title: string;
}
// Returns a list of image urls
export const getCommunityImages = async (community: string) => {
    const { data, error } = await supabase
        .from('Community')
        .select(`
            Arts_Communities (
                Art (
                    id,
                    publicUrl,
                    title
                )
            )
        `)
        .eq('name', community)
        .single();

        if (error) throw error;
    
        const artworks = data.Arts_Communities
            .map(ac => ac.Art)
            .filter((art): art is Art => art !== null); // Type guard to remove nulls
            
        return artworks;
    }

