import { Outlet, useNavigate } from 'react-router-dom'
import { ClerkProvider } from '@clerk/clerk-react'
import Navbar from '@/components/ui/nav-bar'
import { Toaster } from '@/components/ui/toaster'

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
        {/* <header className="h-20 bg-slate-400">
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
        </header> */}
        <Navbar />
        <main className="flex-1 h-[calc(100vh-5rem)]">
          <Outlet />
          <Toaster />
        </main>
      {/* </div> */}
    </ClerkProvider>
  )
}