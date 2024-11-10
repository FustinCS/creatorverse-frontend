// import Image from 'next/image'
import { Card, CardContent } from "@/components/ui/card";
import Tag from "./Tag";
import { useState, useEffect, useRef } from "react";
import { useUser } from "@clerk/clerk-react";
import { Button } from "./ui/button";
import { ImagePlus } from "lucide-react";
import supabase from "@/supabase/client";
import { comparePhoto } from "@/api/api";

export default function ArtPost() {
  // title = "Starry Night", 
  // artist = "Vincent van Gogh", 
  // imageUrl = "https://cobnjvyhgqvaownxctzp.supabase.co/storage/v1/object/public/creator-images/istockphoto-177130309-612x612.jpg", 
  // tags = ["Post-Impressionism", "Night sky", "Swirling clouds", "Cypress tree", "Village"]



  const [artName, setArtName] = useState('');
  const { isSignedIn, user } = useUser();
  const artistUsername = isSignedIn ? user.username : 'loading';
  const [tags, setTags] = useState<string[]>([]);
  const [imageUrl, setImageUrl] = useState('/placeholder.svg');
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    console.log('tags:', tags);//TESTING
  }, [tags]);

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


  const handleImageClick = () => {
    fileInputRef.current?.click()
  }



  const handleImageChange = async(event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      const newImageUrl = URL.createObjectURL(file)
      setImageUrl(newImageUrl)
    }
  }
  const isPlaceholder = imageUrl === '/placeholder.svg';

  const fetchImageFile = async (url: string) => {
    const response = await fetch(url);
    const blob = await response.blob();
    const file = new File([blob], 'image.jpg', { type: blob.type });
    return file;
  };

  const generateTags = async() => {
    if(!imageUrl) {
      return;
    }
    const file = await fetchImageFile(imageUrl);
    // standard upload
      const { data, error } = await supabase.storage.from('temp-images').upload(artistUsername + '-' + artName, file, {
        upsert: true,
      })
      if (error) {
        console.error('image was not uploaded:', error) //<-------
      } else {
        // CALL API HERE
        const publicUrl = data.fullPath;
        try {
          await comparePhoto(publicUrl);
          console.log('photo compared');
        } catch (error) {
          console.error('photo not compared:', error);
        }
      }

  };



  return (
    <div className="h-[calc(100vh-5rem)] overflow-y-auto p-4 flex items-center justify-center">
    <Card className="w-full max-w-2xl mx-auto">
      <CardContent className="p-4 flex flex-col gap-4">
        {/* <h2 className="text-2xl font-bold text-center">{artName}</h2> */}
          <input
          type="text"
          value={artName}
          onChange={(e) => setArtName(e.target.value)}
          className="text-2xl font-bold text-center border-none outline-none bg-transparent bg-slate-200"
          placeholder="Enter art name: "
        />
        <p className="text-lg text-muted-foreground text-center">{artistUsername}</p>
        <div 
          className="relative w-full aspect-[3/2] overflow-hidden rounded-md cursor-pointer group"
          onClick={handleImageClick}
        >
          <img
            src={imageUrl}
            alt={`Artwork: ${artName} by ${artistUsername}`}
            className="w-full h-full object-cover"
            style={{
              objectFit: isPlaceholder ? 'cover' : 'contain',
              width: '100%',
              height: '100%',
            }}

          />
          <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
            <Button variant="secondary" className="pointer-events-none">
              <ImagePlus className="mr-2 h-4 w-4" />
              Change Image
            </Button>
          </div>
        </div>
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleImageChange}
          accept="image/*"
          className="hidden"
        />
        <Button variant='secondary' className="bg-slate-300" onClick={() => generateTags()} >Generate Tags</Button>

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
          <Button variant='default'>Post</Button>
      </CardContent>
    </Card>
    </div>
  )
}