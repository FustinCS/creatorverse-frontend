import { ScrollArea } from "@/components/ui/scroll-area";
import Marquee from "@/components/ui/Marquee";
import { useEffect, useState } from "react";
import supabase from "@/supabase/client";
import { useNavigate } from 'react-router-dom';

type CommunityInfo = {
  name: string;
  Art: { id: string; publicUrl: string }[];
}

type ArtInfo = {
  id: string;
  publicUrl: string;
}

// will duplicate items in array until it hits a certain length
function extendArray(arr: ArtInfo[], minLength: number) {
  if (arr.length >= minLength) return arr;
  const extendedArray = [...arr];
  while (extendedArray.length < minLength) {
    extendedArray.push(...arr.slice(0, minLength - extendedArray.length));
  }
  return extendedArray;
}


export default function Feed() {
  const [communities, setCommunitites] = useState<CommunityInfo[]>([]);
  const [selectedCommunity, setSelectedCommunity] = useState<string | null>(null);
  const navigate = useNavigate();


  useEffect(() => {
    async function fetchCommunities() {
      const { data: communityInfo, error: communityError } = await supabase
        .from("Community")
        .select("name, Art(id, publicUrl)")
        .limit(15);

      if (communityError) {
        console.error("Error fetching communities", communityError);
        return;
      }

      setCommunitites(communityInfo);
    }
    fetchCommunities();
  }, []);

  const handleCommunityClick = (communityName: string) => {
    setSelectedCommunity(communityName);
    // Navigate to the community page
    navigate(`/community/${communityName}`);
  };

  return (
    <main className="h-[calc(100vh-5rem)] w-full">
      {" "}
      {/* Subtracting both navbar and header height */}
      <ScrollArea className="h-full w-full">
        {communities.map((community) => (
          <div 
          key={community.name}
          className="group flex flex-col m-8 items-center justify-center bg-background rounded-3xl cursor-pointer"
          onClick={() => handleCommunityClick(community.name)}
            >
          <h2 className={`scroll-m-20 pb-2 text-3xl font-semibold tracking-tight first:mt-0 p-4 group-hover:scale-110 
            ${selectedCommunity === community.name ? 'text-primary' : ''}`}
            >
            {community.name}
            </h2>
            <div className="relative w-9/12  bg-background ">
              <Marquee runOnHover className="[--duration:15s]">
                {extendArray(community.Art, 10).map((artwork) => (
                  <img
                    key={artwork.id}
                    src={artwork.publicUrl}
                    className="max-w-[150px] h-[10rem] object-cover px-0 py-[10px]"
                  />
                ))}
              </Marquee>
              <div className="pointer-events-none absolute inset-y-0 left-0 w-1/3 bg-gradient-to-r from-white dark:from-background"></div>
              <div className="pointer-events-none absolute inset-y-0 right-0 w-1/3 bg-gradient-to-l from-white dark:from-background"></div>
            </div>
          </div>
        ))}
      </ScrollArea>
    </main>
  );
}
