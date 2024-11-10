import { Art, getCommunityImages } from "@/api/supabase-api";
import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";

export default function CommunityPage() {
  const { communityName } = useParams<{ communityName: string }>();
  const [artworks, setArtworks] = useState<Art[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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
            <CardTitle>Gallery</CardTitle>
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
            <CardTitle>Live Stream</CardTitle>
          </CardHeader>
          <ScrollArea className="h-[calc(100%-4rem)]">
            <CardContent>
              <div className="space-y-4">
                <div className="aspect-video bg-muted rounded-lg" />
              </div>
            </CardContent>
          </ScrollArea>
        </Card>
      </div>
    </div>
  );
}