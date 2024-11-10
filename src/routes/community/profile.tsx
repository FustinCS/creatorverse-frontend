import { Card, CardContent } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { ScrollArea } from "@/components/ui/scroll-area"
import { useUser } from "@clerk/clerk-react"
import { useEffect, useState } from "react"
import { getUserPosts } from "@/api/supabase-api" // Create this function

interface Post {
  id: string
  publicUrl: string
  title: string
}

export default function UserProfile() {
 const { user } = useUser();
 const [posts, setPosts] = useState<Post[]>([]);
 const [loading, setLoading] = useState(true);
 const [error, setError] = useState<string | null>(null);

 useEffect(() => {
   async function loadUserPosts() {
     if (!user?.id) return;
     
     try {
       setLoading(true);
       const data = await getUserPosts(user.id);
       setPosts(data);
     } catch (err) {
       setError(err.message);
     } finally {
       setLoading(false);
     }
   }

   loadUserPosts();
 }, [user?.id]);

 if (!user) return null;
 if (loading) return <div>Loading...</div>;
 if (error) return <div>Error: {error}</div>;

 return (
   <div className="container mx-auto p-4 w-full">
     <Card className="w-full max-w-3xl mx-auto">
       <CardContent className="p-6">
         <div className="flex flex-col items-center mb-6">
           <Avatar className="w-32 h-32 mb-4">
             <AvatarImage src={user.imageUrl} alt={user.fullName || ''} />
             <AvatarFallback>
               {user.fullName?.split(' ').map(n => n[0]).join('') || user.username?.[0]}
             </AvatarFallback>
           </Avatar>
           <h1 className="text-2xl font-bold">{user.fullName}</h1>
           <p className="text-muted-foreground">@{user.username}</p>
         </div>
         
         <div className="flex justify-center space-x-8 mb-6">
           <div className="text-center">
             <p className="text-2xl font-bold">{posts.length}</p>
             <p className="text-sm text-muted-foreground">Posts</p>
           </div>
           <div className="text-center">
             <p className="text-2xl font-bold">59</p>
             <p className="text-sm text-muted-foreground">Friends</p>
           </div>
           {/* Add other stats if needed */}
         </div>

         <h2 className="text-xl font-semibold mb-4">Posts</h2>
         <ScrollArea className="h-[300px] w-full">
           <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
             {posts.map((post) => (
               <div key={post.id} className="relative aspect-square border-2 rounded-lg">
                 <img
                   src={post.publicUrl}
                   alt={post.title}
                   className="rounded-md w-full h-full object-cover"
                 />
               </div>
             ))}
           </div>
         </ScrollArea>
       </CardContent>
     </Card>
   </div>
 )
}