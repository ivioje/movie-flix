
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Film, Clapperboard, Search, Bookmark, User, LogIn } from "lucide-react";
import { SignedIn, SignedOut } from "@clerk/clerk-react";

const Index = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background text-foreground">
      <div className="container max-w-5xl px-4 py-8 text-center space-y-8">
        <div className="space-y-4">
          <h1 className="text-5xl md:text-6xl font-bold tracking-tight">Welcome to MovieFlix</h1>
          <p className="text-xl text-muted-foreground md:max-w-3xl mx-auto">
            Your ultimate destination for exploring movies, tracking favorites, and discovering new content
          </p>
        </div>
        
        <div className="flex flex-wrap gap-4 justify-center mt-6">
          <SignedIn>
            <Button asChild size="lg" className="gap-2">
              <Link to="/dashboard">
                <User className="h-5 w-5" />
                My Dashboard
              </Link>
            </Button>
          </SignedIn>
          
          <SignedOut>
            <Button asChild size="lg" className="gap-2">
              <Link to="/auth">
                <LogIn className="h-5 w-5" />
                Sign in
              </Link>
            </Button>
          </SignedOut>
          
          <Button asChild size="lg" variant="outline" className="gap-2">
            <Link to="/home">
              <Film className="h-5 w-5" />
              Browse Movies
            </Link>
          </Button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
          <div className="flex flex-col items-center p-6 rounded-lg border bg-card">
            <Clapperboard className="h-12 w-12 mb-4 text-primary" />
            <h3 className="text-xl font-semibold">Extensive Library</h3>
            <p className="text-muted-foreground mt-2">
              Access thousands of movies from classics to the latest releases
            </p>
          </div>
          
          <div className="flex flex-col items-center p-6 rounded-lg border bg-card">
            <Search className="h-12 w-12 mb-4 text-primary" />
            <h3 className="text-xl font-semibold">Powerful Search</h3>
            <p className="text-muted-foreground mt-2">
              Find any movie or actor with our advanced search capabilities
            </p>
          </div>
          
          <div className="flex flex-col items-center p-6 rounded-lg border bg-card">
            <Bookmark className="h-12 w-12 mb-4 text-primary" />
            <h3 className="text-xl font-semibold">Personalized Experience</h3>
            <p className="text-muted-foreground mt-2">
              Bookmark favorites and get recommendations based on your taste
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
