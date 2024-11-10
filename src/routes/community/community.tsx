import { Art, getCommunityImages } from "@/api/supabase-api";
import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Camera } from "lucide-react";

export default function CommunityPage() {
  const { communityName } = useParams<{ communityName: string }>();
  const [artworks, setArtworks] = useState<Art[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const activeCalls = [
    { id: 1, name: "Chat Room 1", avatarUrl: "https://i.pravatar.cc/150?u=alice" },
    { id: 2, name: "Chat Room 1", avatarUrl: "https://i.pravatar.cc/150?u=bob" },
    { id: 3, name: "Chat Room 1", avatarUrl: "https://i.pravatar.cc/150?u=charlie" },
    { id: 4, name: "Chat Room 1", avatarUrl: "https://i.pravatar.cc/150?u=diana" },
    { id: 5, name: "Chat Room 1", avatarUrl: "https://i.pravatar.cc/150?u=edward" },
    { id: 6, name: "Chat Room 1", avatarUrl: "https://i.pravatar.cc/150?u=fiona" },
    { id: 7, name: "Chat Room 1", avatarUrl: "https://i.pravatar.cc/150?u=george" },
    { id: 8, name: "USC Chat Room 1", avatarUrl: "https://i.pravatar.cc/150?u=helen" },
  ]

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
        <Card className="flex-1">
          <CardHeader>
            <CardTitle>Video Channel</CardTitle>
          </CardHeader>
          <ScrollArea className="h-[calc(100%-4rem)]">
          <ul className="space-y-4 p-4">
            {activeCalls.map((call) => (
              <li key={call.id} className="flex items-center justify-between space-x-4 p-2 rounded-md hover:bg-accent">
                <div className="flex items-center space-x-4">
                  <Avatar>
                    <AvatarImage src={call.avatarUrl} alt={call.name} />
                    <AvatarFallback>{call.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="text-sm font-medium leading-none">{call.name}</p>
                    <p className="text-sm text-muted-foreground">In call</p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Camera className="h-4 w-4 text-muted-foreground" />
                  <Button size="sm">Join</Button>
                </div>
              </li>
            ))}
          </ul>
          </ScrollArea>
        </Card>
      </div>
    </div>
  );
}