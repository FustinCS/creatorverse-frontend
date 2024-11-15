import React from 'react'
import ReactDOM from 'react-dom/client'
import './index.css'
import { RouterProvider, createBrowserRouter } from 'react-router-dom'

// Import the layouts
import RootLayout from './layouts/root-layout'
import DashboardLayout from './layouts/dashboard-layout'

// Import the components
import IndexPage from './routes'
import SignInPage from './routes/sign-in'
import SignUpPage from './routes/sign-up'
import CommunityPage from './routes/community/community'
import PostPage from './routes/PostPage'
import { RedirectToSignIn, SignedIn, SignedOut } from '@clerk/clerk-react'
import Feed from './routes/community/feed'
import Profile from './routes/community/profile'
import ExplorePage from './routes/Explore'
import { SocketContextProvider } from './context/SocketContext'

const router = createBrowserRouter([
  {
    element: <RootLayout />,
    children: [
      { path: '/', element: <IndexPage /> },
      { path: '/sign-in/*', element: <SignInPage /> },
      { path: '/sign-up/*', element: <SignUpPage /> },
      { path: '/post', element: (
        

        <>
          <SignedIn>
            <PostPage />
          </SignedIn>
          <SignedOut>
            <RedirectToSignIn />
          </SignedOut>
        </>
      )}, 
      { path: '/explore', element: <ExplorePage /> },
      {
        element: <DashboardLayout />,
        path: 'community',
        children: [
          {path: "/community/:communityName", element: <CommunityPage />},
          { path: '/community/feed', element: <Feed/> },
          { path: '/community/profile', element: <Profile /> },
        ],
      },
    ],
  },
])

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <SocketContextProvider>
      <RouterProvider router={router} />
    </SocketContextProvider>
  </React.StrictMode>,
)