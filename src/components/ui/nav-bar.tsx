import { Link, useLocation } from "react-router-dom"
import { Home, Compass, PenSquare, User } from "lucide-react"
import { UserButton, SignedIn, SignedOut } from "@clerk/clerk-react"

const navItems = [
  { name: "Home", href: "/", icon: Home },
  { name: "Explore", href: "/explore", icon: Compass },
  { name: "Post", href: "/post", icon: PenSquare },
  { name: "Profile", href: "/profile", icon: User },
]

export default function Navbar() {
  const location = useLocation()
  const pathname = location.pathname

  return (
    <nav className="bg-background border-b h-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full">
        <div className="flex items-center justify-between h-full">
          <div className="flex-shrink-0">
            <Link to="/" className="text-2xl font-bold text-primary">
              Creatorverse
            </Link>
          </div>
          
          {/* Desktop Navigation */}
          <div className="hidden md:block">
            <div className="ml-10 flex items-center space-x-4">
              {navItems.map((item) => (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`px-3 py-2 rounded-md text-sm font-medium ${
                    pathname === item.href
                      ? "bg-primary text-primary-foreground"
                      : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                  }`}
                >
                  {item.name}
                </Link>
              ))}
              <div className="ml-4">
                <SignedIn>
                  <UserButton afterSignOutUrl="/"/>
                </SignedIn>
                <SignedOut>
                  <Link 
                    to="/sign-in"
                    className="px-3 py-2 rounded-md text-sm font-medium text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                  >
                    Sign In
                  </Link>
                </SignedOut>
              </div>
            </div>
          </div>

          {/* Mobile Navigation */}
          <div className="md:hidden flex items-center space-x-4">
            {navItems.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                className={`p-2 rounded-md ${
                  pathname === item.href
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                }`}
              >
                <item.icon className="h-6 w-6" />
                <span className="sr-only">{item.name}</span>
              </Link>
            ))}
            <div className="ml-2">
              <SignedIn>
              </SignedIn>
              <SignedOut>
                <Link 
                  to="/sign-in"
                  className="p-2 rounded-md text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                >
                  <User className="h-6 w-6" />
                  <span className="sr-only">Sign In</span>
                </Link>
              </SignedOut>
            </div>
          </div>
        </div>
      </div>
    </nav>
  )
}