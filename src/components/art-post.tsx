// import Image from 'next/image'
import { Card, CardContent } from "@/components/ui/card";
import Tag from "./Tag";
import { useState, useEffect } from "react";
import { useUser } from "@clerk/clerk-react";

export default function ArtPost() {
  // title = "Starry Night", 
  // artist = "Vincent van Gogh", 
  // imageUrl = "https://cobnjvyhgqvaownxctzp.supabase.co/storage/v1/object/public/creator-images/istockphoto-177130309-612x612.jpg", 
  // tags = ["Post-Impressionism", "Night sky", "Swirling clouds", "Cypress tree", "Village"]



  const [artName, setArtName] = useState('');
  const { isSignedIn, user } = useUser();
  const artistUsername = isSignedIn ? user.username : 'loading';
  const [imgUrl, setImgUrl] = useState<string>('');
  const [tags, setTags] = useState<string[]>([]);


  useEffect(()=> {
    if(!isSignedIn){
      console.error('post-page: not signed in yet');
      return;
    }
    
      
  }, [isSignedIn])

  const addTag = (tagName: string) => {
    setTags((prev) => (
      [...prev, tagName]
    ))
  };

  const removeTag = (tagName: string) => {
    setTags(prev => prev.filter(tag => tag !== tagName))
  }


  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardContent className="p-6 flex flex-col gap-4">
        <h2 className="text-2xl font-bold text-center">{artName}</h2>
        <p className="text-lg text-muted-foreground text-center">{artistUsername}</p>
        <div className="relative w-full aspect-[3/2] overflow-hidden rounded-md">
          {/* <Image
            src={imageUrl}
            alt={`Artwork: ${title} by ${artist}`}
            fill
            className="object-cover"
          /> */}
          <img             
            src={imgUrl}
            alt={`Artwork: ${artName} by ${artistUsername}`}
            className="border border-black rounded-lg "
            />
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 mt-4">
          {tags.map((tag, index) => (
            <Tag  
              index={index + tag}
              name={tag}
              added={tags.includes(tag)}
              custom={false}
              addTagHandler={addTag}
              removeTagHandler={removeTag}
            />
          ))}
          <Tag
            index={'new'}
            name={''}
            added={false}
            custom={true}
            addTagHandler={addTag}
            removeTagHandler={removeTag}
          />
        </div>
      </CardContent>
    </Card>
  )
}