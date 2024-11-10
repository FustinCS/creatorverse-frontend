import { useEffect } from 'react'
import { useUser } from '@clerk/clerk-react'
import LandingPage from '../components/landing-page'
import supabase from '../supabase/client'



export default function IndexPage() {
    const { isSignedIn, user} = useUser();
    // const [loading, setLoading] = useState(true)



    useEffect(() => {
        console.log('is signed in?', isSignedIn);
        if (isSignedIn && user) {
          const createOrUpdateUser = async () => {
            const clerk_id = user.id;
            const username = user.username;
            if(!username){
                console.error('no username');
                return;
            }
            // const email = user.emailAddress;
            const { data, error } = await supabase
              .rpc('create_user_from_clerk', {
                clerk_id: clerk_id,
                username: username,
              });
    
            if (error) {
              console.error('Error creating/updating user:', error);
            } else {
              console.log('User created/updated successfully:', data);
            }
          };
          createOrUpdateUser();
        }
      }, [isSignedIn, user]);

    if (!isSignedIn) {
        return (
        <LandingPage/>
    )
    }

    return (
    <div>
        <h1>This is the index page</h1>
        <div>
        </div>
    </div>
    )
}
