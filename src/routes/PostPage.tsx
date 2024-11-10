import ArtPost from "@/components/art-post"
import { ScrollArea } from "@radix-ui/react-scroll-area"

const PostPage = () => {
  
  return (
      <ScrollArea className="h-full w-full">
        <ArtPost></ArtPost>
      </ScrollArea>
  )
}

export default PostPage