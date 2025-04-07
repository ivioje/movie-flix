
import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useUser, SignInButton, UserButton } from "@clerk/clerk-react";
import { Search, Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ThemeToggle } from "@/components/theme-toggle";
import { cn } from "@/lib/utils";
import { fetchAutoComplete } from "@/services/api";

interface NavbarProps {
  isScrolled?: boolean;
}

export const Navbar = ({ isScrolled = false }: NavbarProps) => {
  const { isSignedIn } = useUser();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [showSearch, setShowSearch] = useState(false);
  const navigate = useNavigate();

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
  const toggleSearch = () => setShowSearch(!showSearch);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      setShowSearch(false);
      navigate(`/search?q=${encodeURIComponent(searchQuery)}`);
      setSearchQuery("");
    }
  };

  useEffect(() => {
    const getAutoComplete = async () => {
      if (searchQuery.length > 2) {
        try {
          const results = await fetchAutoComplete(searchQuery);
          setSearchResults(results);
        } catch (error) {
          console.error("Error fetching autocomplete:", error);
        }
      } else {
        setSearchResults([]);
      }
    };

    const debounce = setTimeout(() => {
      getAutoComplete();
    }, 300);

    return () => clearTimeout(debounce);
  }, [searchQuery]);

  return (
    <header
      className={cn(
        "sticky top-0 z-40 w-full transition-all duration-200",
        isScrolled ? "bg-background/95 backdrop-blur-sm border-b" : "bg-transparent"
      )}
    >
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center">
          <Link to="/" className="flex items-center">
            <span className="text-xl font-bold text-primary">MovieFlix</span>
          </Link>
          <nav className="hidden ml-6 md:flex items-center space-x-4">
            <Link to="/home" className="navbar-item">Home</Link>
            <Link to="/movies" className="navbar-item">Movies</Link>
            <Link to="/search?category=tv" className="navbar-item">TV Shows</Link>
            {isSignedIn && (
              <Link to="/dashboard" className="navbar-item">My Profile</Link>
            )}
          </nav>
        </div>

        <div className="flex items-center gap-2">
          <div className={cn("relative", showSearch ? "hidden md:block" : "hidden")}>
            <form onSubmit={handleSearch}>
              <Input
                type="search"
                placeholder="Search movies, TV shows..."
                className="w-[200px] md:w-[300px]"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </form>
            {searchResults.length > 0 && searchQuery.length > 2 && (
              <div className="absolute top-full mt-1 w-full bg-background border rounded-md shadow-md z-50">
                {searchResults.slice(0, 5).map((result: any) => (
                  <Link
                    key={result.id}
                    to={`/movie/${result.id}`}
                    className="block p-2 hover:bg-muted/50"
                    onClick={() => setShowSearch(false)}
                  >
                    {result.title}
                  </Link>
                ))}
              </div>
            )}
          </div>

          <Button 
            variant="ghost" 
            size="icon" 
            onClick={toggleSearch}
            className={cn("hidden md:flex", showSearch ? "bg-muted" : "")}
          >
            <Search className="h-5 w-5" />
          </Button>

          <ThemeToggle />

          <div className="hidden md:block">
            {isSignedIn ? (
              <UserButton afterSignOutUrl="/" />
            ) : (
              <SignInButton mode="modal">
                <Button>Sign In</Button>
              </SignInButton>
            )}
          </div>

          <Button variant="ghost" size="icon" onClick={toggleMenu} className="md:hidden">
            {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </div>
      </div>

      {/* Mobile menu */}
      {isMenuOpen && (
        <div className="md:hidden border-t p-4 bg-background">
          <nav className="flex flex-col space-y-4">
            <Link to="/" className="navbar-item" onClick={() => setIsMenuOpen(false)}>Home</Link>
            <Link to="/search?category=movie" className="navbar-item" onClick={() => setIsMenuOpen(false)}>Movies</Link>
            <Link to="/search?category=tv" className="navbar-item" onClick={() => setIsMenuOpen(false)}>TV Shows</Link>
            {isSignedIn && (
              <Link to="/dashboard" className="navbar-item" onClick={() => setIsMenuOpen(false)}>My Profile</Link>
            )}
            <div className="pt-2">
              <form onSubmit={handleSearch} className="mb-4">
                <Input
                  type="search"
                  placeholder="Search movies, TV shows..."
                  className="w-full"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </form>
              {!isSignedIn && (
                <SignInButton mode="modal">
                  <Button className="w-full">Sign In</Button>
                </SignInButton>
              )}
            </div>
          </nav>
        </div>
      )}
    </header>
  );
};
