// import Image from 'next/image'
import { Card, CardContent } from "@/components/ui/card";
import Tag from "./Tag";
import { useState, useRef } from "react";
import { useUser } from "@clerk/clerk-react";
import { Button } from "./ui/button";
import { ImagePlus } from "lucide-react";
import supabase, { BUCKET_KEY } from "@/supabase/client";
import { comparePhoto } from "@/api/api";
import { useToast } from "@/hooks/use-toast";
import { LoadingSpinner } from "./LoadingSpinner";

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
  const { toast } = useToast();
  const [tagsLoading, setTagsLoading] = useState(false);


  // useEffect(() => {
  //   console.log('tags:', tags);//TESTING
  // }, [tags]);

  // useEffect(()=> {
  //   if(!isSignedIn){
  //     console.error('post-page: not signed in yet');
  //     return;
  //   }
  // }, [isSignedIn])
  if(!user){
    return <p>No user 🥺</p>
  }

  const addTag = (tagName: string) => {
    setTags((prev) => {
      if (prev.includes(tagName)) {
        return prev; 
      }
      return [...prev, tagName]; 
    });
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
    console.log('genTags:', imageUrl, artName);//TESTING
    if(imageUrl === '/placeholder.svg' || artName === '') {
      toast({
        title: "Oops!",
        description: imageUrl === '/placeholder.svg' ? "No ImageUrl!" : "Enter an art name!",
        variant: "destructive"
      })
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
        const publicUrl = BUCKET_KEY + data.fullPath;
        setTagsLoading(true);//TESTING
        try {
          const { result } = await comparePhoto(publicUrl);
          const filteredSuggestedTags = result.filter(suggestion => suggestion.similarity_score >= 0.7);
          filteredSuggestedTags.forEach(suggestion => addTag(suggestion.community));
          console.log('photo compared');
          setTagsLoading(false);
        } catch (error) {
          console.error('photo not compared:', error);
        }
      }

  };

  /**
   * Synchronize tags with the Community table in Supabase.
   * @param {string[]} tags - Array of tag names to synchronize.
   */
  const synchronizeTags = async () => {
    if (!tags || tags.length === 0) {
      console.log('No tags to synchronize.');
      return;
    }
    try {
      // Call the upsert_communities function with the tags array
      const { data, error } = await supabase
        .rpc('upsert_communities', { tag_names: tags });
      if (error) {
        throw error;
      }
      console.log('Tags synchronized successfully:', data);
    } catch (error) {
      console.error('Error synchronizing tags:', error);
    }
  };

  const submitPost = async () => {
    if(imageUrl === '/placeholder.svg' || artName === '') {
      toast({
        title: "Oops!",
        description: imageUrl === '/placeholder.svg' ? "No ImageUrl!" : "Enter an art name!",
        variant: "destructive"
      })
      return;
    }
    if(tags.length === 0){
      toast({
        title: "Oops!",
        description: 'Make sure to generate or add a community tag!',
        variant: "destructive"
      });
      return;
    }
    // upload to creator image bucket
    // standard upload
    const file = await fetchImageFile(imageUrl);
    const { data, error } = await supabase.storage.from('creator-images').upload(artistUsername + '-' + artName, file );
    if(error){
      console.error('error submitting art post:', error);
      return;
    }
    // create communities if they dont exist
    await synchronizeTags();

    // post to art
    const { data: artData, error:artError } = await supabase.from('Art').insert({
      publicUrl: BUCKET_KEY + data.fullPath,
      title: artName, 
      userId: user.id
    }).select();

    if(artError){
      console.error('error submitting art post after posting to communities:', artError);
      return;
    }
    const artId = artData[0].id;

  // Fetch communityId for each tag and post to arts-communities
  for (const tag of tags) {
    const { data: communityData, error: communityError } = await supabase
      .from('Community')
      .select('id')
      .eq('name', tag)
      .single();
    if (communityError) {
      console.error(`error fetching communityId for tag ${tag}:`, communityError);
      return;
    }
    const communityId = communityData.id;
    // Post to arts-communities
    const { error: artComError } = await supabase.from('Arts_Communities').insert({
      artId: artId,
      communityId: communityId
    });
    if (artComError) {
      console.error(`error submitting art post to arts-communities for tag ${tag}:`, artComError);
      return;
    }
    // Post to users-communities
    const { error: userComError } = await supabase.from('Users_Communities').insert({
      userId: user.id,
      communityId: communityId
    });
    if (userComError) {
      console.error(`error submitting user to users-communities for tag ${tag}:`, userComError);
      return;
    }
  }
  toast({
    variant: 'default',
    title: "Art Posted!",
  })
  }


  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardContent className="p-6 flex flex-col gap-4">
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
            className="w-full h-full object-cover border border-black rounded-lg"
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
        <div className="my-auto w-full">{tagsLoading && LoadingSpinner({className: 'w-12 h-12'})}</div>
        <Button 
          variant='secondary' 
          className="bg-green-400 hover:bg-green-500 w-[10rem] ml-auto" 
          onClick={() => generateTags()}
        >
          Generate Tags
        </Button>

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 mt-4">
          {tags.map((tag, index) => (
            <Tag  
              key={index + tag}
              name={tag}
              added={tags.includes(tag)}
              custom={false}
              addTagHandler={addTag}
              removeTagHandler={removeTag}
            />
          ))}
          <Tag
            name={''}
            added={false}
            custom={true}
            addTagHandler={addTag}
            removeTagHandler={removeTag}
          />
        </div>
          <Button variant='default' onClick={submitPost}>Post</Button>
      </CardContent>
    </Card>
  )
}