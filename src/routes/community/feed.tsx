import { Link } from 'react-router-dom'
import {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselNext,
    CarouselPrevious,
  } from "src/components/ui/carousel"

  
export default function CommunityPage() {
  return (
    <>
      <h1>Feed Page</h1>
      <p>This is the feed.</p>

      <ul>
        <li>
          <Link to="/community/"></Link>
        </li>
      </ul>
    </>
  )
}