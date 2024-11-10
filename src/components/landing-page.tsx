import { SignedOut, SignInButton, SignedIn, UserButton } from "@clerk/clerk-react";
import { Button } from "./ui/button";
import { FlipWordsPage } from "./ui/landing-page-text";

export default function LandingPage() {
    return (
        <div className="flex-col justify-center">
        <FlipWordsPage />
        <div className="flex justify-center h-30">
          <SignedOut>
            <SignInButton>
              <Button className="h-full w-auto">Join Creatorverse</Button>
            </SignInButton>
          </SignedOut>
          <SignedIn>
            <UserButton />
          </SignedIn>
        </div>
      </div>

    )
}
