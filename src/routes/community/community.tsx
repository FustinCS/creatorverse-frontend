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
    <div className="container mx-auto p-4 min-h-screen">
      <h1 className="text-2xl font-bold mb-6 capitalize">{communityName}</h1>
      
      <div className="flex flex-col lg:flex-row gap-4 h-full">
        {/* Gallery Section */}
        <Card className="flex-1 flex flex-col">
          <CardHeader>
            <CardTitle>Gallery</CardTitle>
          </CardHeader>
          <CardContent className="flex-1">
            <ScrollArea className="h-[calc(100vh-200px)] lg:h-[calc(100vh-240px)]">
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {artworks.map((art) => (
                  <div key={art.id} className="relative aspect-square group">
                    <img
                      src={art.publicUrl}
                      alt={art.title}
                      className="rounded-md w-full h-full object-cover transition-transform duration-200 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-end">
                      <p className="text-white p-2 text-sm truncate w-full">
                        {art.title}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>
          </CardContent>
        </Card>

        {/* Video/Chat Section */}
        <Card className="flex-1 flex flex-col">
          <CardHeader>
            <CardTitle>Live Stream</CardTitle>
          </CardHeader>
          <CardContent className="flex-1">
            <div className="aspect-video bg-muted rounded-lg mb-4">
              {/* Video placeholder */}
              <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                Stream not available
              </div>
            </div>
            
            {/* Chat area */}
            <ScrollArea className="h-[calc(100vh-450px)]">
              <div className="space-y-4">
                <p className="text-center text-muted-foreground">
                  Chat messages will appear here
                </p>
              </div>
            </ScrollArea>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}