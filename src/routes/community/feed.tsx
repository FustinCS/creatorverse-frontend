import { Link } from 'react-router-dom'
import {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselNext,
    CarouselPrevious,
  } from "@/components/ui/carousel"

  
export default function Feed() {
  return (
    <>
      <h1>Feed Page</h1>
      <Carousel>
    <CarouselContent>
        <CarouselItem>item1</CarouselItem>
        <CarouselItem>item2</CarouselItem>
        <CarouselItem>item3</CarouselItem>
    </CarouselContent>
    <CarouselPrevious />
    <CarouselNext />
    </Carousel>
    </>
  )
}