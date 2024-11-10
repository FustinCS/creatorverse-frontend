import { Art, getCommunityImages } from "@/api/supabase-api";
import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import supabase from "@/supabase/client";
import VideoChat from "@/components/VideoChat";

export type ActiveCallsType = {
    artistId: string;
    artistName: string;
    artistAvatarUrl: string;
};
export default function CommunityPage() {
    const { communityName } = useParams<{ communityName: string }>();
    const [artworks, setArtworks] = useState<Art[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [activeCalls, setActiveCalls] = useState<ActiveCallsType[]>([]);

    useEffect(() => {
        const pictures = [
            "https://i.pravatar.cc/150?u=alice",
            "https://i.pravatar.cc/150?u=bob",
            "https://i.pravatar.cc/150?u=charlie",
            "https://i.pravatar.cc/150?u=diana",
            "https://i.pravatar.cc/150?u=edward",
            "https://i.pravatar.cc/150?u=fiona",
            "https://i.pravatar.cc/150?u=george",
            "https://i.pravatar.cc/150?u=helen",
        ];
        const getRandomPicture = () => {
            const randomIndex = Math.floor(Math.random() * pictures.length);
            return pictures[randomIndex];
        };
        const loadMembersOfCommunity = async () => {
            const { data, error } = await supabase
                .from("Users_Communities")
                .select("userId, Community!inner(name), User:User(*)")
                .filter("Community.name", "eq", communityName);
            if (error) {
                setError(error.message);
            } else {
                const mappedData: ActiveCallsType[] =
                    data.map((item) => ({
                        artistId: item.userId,
                        artistName: item.User!.username ?? "Unknown User",
                        artistAvatarUrl: getRandomPicture(),
                    })) || [];
                setActiveCalls(mappedData);
            }
        };
        loadMembersOfCommunity();
    }, [communityName]);

    useEffect(() => {
        async function loadImages() {
            if (!communityName) return;
            try {
                setLoading(true);
                const data = await getCommunityImages(communityName);
                setArtworks(data);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        }
        loadImages();
    }, [communityName]);

    if (loading) return <div>Loading...</div>;
    if (error) return <div>Error: {error}</div>;

    return (
        <div className="h-[calc(100vh-5rem)] p-4">
            <div className="flex gap-4 h-full">
                {/* Left Card */}
                <Card className="flex-1">
                    <CardHeader>
                        <CardTitle>{communityName}</CardTitle>
                    </CardHeader>
                    <ScrollArea className="h-[calc(100%-4rem)]">
                        <CardContent>
                            <div className="grid grid-cols-2 gap-4">
                                {artworks.map((art) => (
                                    <div key={art.id} className="aspect-square">
                                        <img
                                            src={art.publicUrl}
                                            alt={art.title}
                                            className="rounded-md w-full h-full object-cover"
                                        />
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </ScrollArea>
                </Card>

                {/* Right Card */}
                <VideoChat activeCalls={activeCalls} />
            </div>
        </div>
    );
}
