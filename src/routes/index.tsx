import { useEffect } from 'react'
import { useUser } from '@clerk/clerk-react'

import { Link } from 'react-router-dom'
import LandingPage from '../components/landing-page'

export default function IndexPage() {
    const { isSignedIn, user} = useUser()

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