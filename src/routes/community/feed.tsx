import Banner from "@/components/Banner";
import { Card, CardContent } from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { ScrollArea } from "@/components/ui/scroll-area";
import Marquee from "@/components/ui/Marquee";
import { useEffect, useState } from "react";
import supabase from "@/supabase/client";
import CommunityPage from "./community";

const art = [
  { name: "Kirby" },
  { name: "Meta Knight" },
  { name: "Kirby" },
  { name: "Meta Knight" },
  { name: "Kirby" },
  { name: "Meta Knight" },
  { name: "Kirby" },
  { name: "Meta Knight" },
  { name: "Kirby" },
  { name: "Meta Knight" },
];

type CommunityInfo = {
  name: string;
  Art: { id: string; publicUrl: string }[];
}


export default function Feed() {
  const [communities, setCommunitites] = useState<CommunityInfo[]>([]);

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

  return (
    <main className="h-[calc(100vh-8rem)] w-full">
      {" "}
      {/* Subtracting both navbar and header height */}
      <ScrollArea className="h-full w-full my-16">
        {communities.map((community) => (
          <div className="group flex flex-col mx-16 items-center justify-center bg-background rounded-3xl cursor-pointer">
            <h2 className="scroll-m-20  pb-2 text-3xl font-semibold tracking-tight first:mt-0 p-4 group-hover:scale-110">
              {community.name}
            </h2>
            <div className="relative w-9/12  bg-background ">
              <Marquee runOnHover className="[--duration:15s]">
                {community.Art.map((artwork) => (
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
