// import Image from 'next/image'
import { Card, CardContent } from "@/components/ui/card";

export default function ArtPost({ 
  title = "Starry Night", 
  artist = "Vincent van Gogh", 
  imageUrl = "/placeholder.svg?height=400&width=600", 
  tags = ["Post-Impressionism", "Night sky", "Swirling clouds", "Cypress tree", "Village"]
}: { 
  title?: string
  artist?: string
  imageUrl?: string
  tags?: string[]
}) {
  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardContent className="p-6 flex flex-col gap-4">
        <h2 className="text-2xl font-bold text-center">{title}</h2>
        <p className="text-lg text-muted-foreground text-center">{artist}</p>
        <div className="relative w-full aspect-[3/2] overflow-hidden rounded-md">
          {/* <Image
            src={imageUrl}
            alt={`Artwork: ${title} by ${artist}`}
            fill
            className="object-cover"
          /> */}
          <img             
            src={imageUrl}
            alt={`Artwork: ${title} by ${artist}`}
        
            />
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 mt-4">
          {tags.map((tag, index) => (
            <span 
              key={index} 
              className="bg-muted text-muted-foreground text-sm py-1 px-2 rounded-full text-center"
            >
              {tag}
            </span>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}