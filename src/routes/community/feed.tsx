import { getUserCommunities } from "@/api/supabase-api"
import { Card, CardContent } from "@/components/ui/card"
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel"
import { ScrollArea } from "@/components/ui/scroll-area"
import { SignedIn, useUser } from "@clerk/clerk-react"
import { useEffect, useState } from "react"

// const categories = [
//     {title: "kirby"},
//     {title: "animals"},
//     {title: "digital art"},
// ]

interface Item {
    title: string;
    description: string;
  }
  
interface Items {
[key: string]: Item[];  // This makes it a string-indexed type
}

const items = {
  kirby: [
    { title: "Kirby Pink", description: "The beloved pink puffball" },
    { title: "Meta Knight", description: "Mysterious masked warrior" },
    { title: "King Dedede", description: "Self-proclaimed king" },
    { title: "Waddle Dee", description: "Loyal helper" },
    { title: "Bandana Dee", description: "Spear wielding friend" },
  ],
  animals: [
    { title: "Cats", description: "Curious feline friends" },
    { title: "Dogs", description: "Loyal companions" },
    { title: "Birds", description: "Colorful aerial acrobats" },
    { title: "Rabbits", description: "Hoppy little buddies" },
    { title: "Hamsters", description: "Tiny ball of fluff" },
  ],
  "digital art": [
    { title: "Pixel Art", description: "Retro style graphics" },
    { title: "3D Renders", description: "Computer generated art" },
    { title: "Digital Paintings", description: "Traditional art goes digital" },
    { title: "Vector Art", description: "Clean and scalable" },
    { title: "Character Design", description: "Original character concepts" },
  ]
}

export default function Feed() {
    const { user, isSignedIn } = useUser();
    const [categories, setCommunities] = useState<Community[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
  
    useEffect(() => {
      async function loadCommunities() {
        // Check if user and user.id exist
        if (!user?.id) return;
        
        try {
          setLoading(true);
          const userCommunities = await getUserCommunities(user.id);
          setCommunities(userCommunities);
        } catch (err) {
          setError(err.message);
        } finally {
          setLoading(false);
        }
      }
  
      loadCommunities();
    }, [user]);
  
    // Early return if not signed in
    if (!isSignedIn || !user) {
      return null;
    }
  
    if (loading) {
      return <div>Loading your communities...</div>;
    }
  
    if (error) {
      return <div>Error loading communities: {error}</div>;
    }

  return (
    <main className="h-[calc(100vh-8rem)] w-full"> {/* Subtracting both navbar and header height */}
      <ScrollArea className="h-full w-full">
        <div className="space-y-8 p-6">
          {categories.map((category, categoryIndex) => (
            <div key={categoryIndex} className="space-y-3">
              <h2 className="text-2xl font-bold capitalize pl-4">
                {category.title}
              </h2>
              
              <Carousel
                opts={{
                  align: "start",
                  loop: true,
                }}
                className="w-full max-w-5xl mx-auto"
              >
                <CarouselContent className="-ml-2 md:-ml-4">
                  {(items[category.title.toLowerCase()] || []).map((item, index) => (
                    <CarouselItem 
                      key={index} 
                      className="pl-2 md:pl-4 md:basis-1/4"
                    >
                      <div className="p-1">
                        <Card className="border hover:border-primary transition-all duration-200">
                          <CardContent className="flex flex-col aspect-square items-center justify-center p-4 gap-2">
                            <h3 className="text-lg font-semibold">{item.title}</h3>
                            <p className="text-sm text-muted-foreground text-center">{item.description}</p>
                          </CardContent>
                        </Card>
                      </div>
                    </CarouselItem>
                  ))}
                </CarouselContent>
                <div className="flex items-center justify-end gap-2 mt-2">
                  <CarouselPrevious />
                  <CarouselNext />
                </div>
              </Carousel>
            </div>
          ))}
        </div>
      </ScrollArea>
    </main>
  )
}