import { Card, CardContent } from "@/components/ui/card"
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel"

const items = [
  { title: "Leaf", description: "Description 1" },
  { title: "Digital Art", description: "Description 2" },
  { title: "Kirby", description: "Description 3" },
  { title: "Animals", description: "Description 4" },
  { title: "Buckets", description: "Description 5" },
]

export default function Feed() {
  return (
    <div className="w-full py-10">
      <Carousel
        opts={{
          align: "start",
          loop: true,
        }}
        className="w-full max-w-5xl mx-auto"
      >
        <CarouselContent className="-ml-2 md:-ml-4">
          {items.map((item, index) => (
            <CarouselItem 
              key={index} 
              className="pl-2 md:pl-4 md:basis-1/2"
            >
              <div className="p-1">
                <Card className="border-2 hover:border-primary transition-all duration-200">
                  <CardContent className="flex flex-col aspect-square items-center justify-center p-6 gap-4">
                    <h3 className="text-xl font-semibold">{item.title}</h3>
                    <p className="text-muted-foreground text-center">{item.description}</p>
                  </CardContent>
                </Card>
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
          <CarouselPrevious/>
          <CarouselNext />
      </Carousel>
    </div>
  )
}