import { Link, Outlet, useNavigate } from 'react-router-dom'
import { ClerkProvider, SignedIn, SignedOut, UserButton } from '@clerk/clerk-react'

const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY

if (!PUBLISHABLE_KEY) {
  throw new Error('Missing Publishable Key')
}

export default function RootLayout() {
  const navigate = useNavigate()

  return (
    <ClerkProvider
      routerPush={(to) => navigate(to)}
      routerReplace={(to) => navigate(to, { replace: true })}
      publishableKey={PUBLISHABLE_KEY}
    >
      {/* <div className='flex flex-col min-h-screen'> */}
        <header className="h-20 bg-slate-400">
            <nav className='flex flex-row'>
              <p className=''>Creatorverse</p>
              <p>testing link 2</p>
              <SignedIn>
              <UserButton />
              </SignedIn>
              <SignedOut>
                <Link to="/sign-in">Sign In</Link>
              </SignedOut>
            </nav>
        </header>
        <main className='flex-grow h-[100vh]'>
          <Outlet />
        </main>
      {/* </div> */}
    </ClerkProvider>
  )
}