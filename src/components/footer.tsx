
import { Link } from "react-router-dom";

export function Footer() {
  return (
    <footer className="border-t bg-background py-6 md:py-0">
      <div className="container flex flex-col md:flex-row items-center justify-between gap-4 md:h-24">
        <div className="flex flex-col md:flex-row items-center gap-4 md:gap-2 md:mr-4">
          <Link to="/" className="flex items-center">
            <span className="text-xl font-bold text-primary">MovieFlix</span>
          </Link>
          <p className="text-sm text-muted-foreground text-center md:text-left">
            &copy; {new Date().getFullYear()} MovieFlix. All rights reserved.
          </p>
        </div>
        
        <nav className="flex flex-wrap justify-center md:justify-end gap-4 md:gap-6 text-sm">
          <Link to="/" className="hover:underline hover:text-primary transition-colors">
            Home
          </Link>
          <Link to="/search?category=movie" className="hover:underline hover:text-primary transition-colors">
            Movies
          </Link>
          <Link to="/search?category=tv" className="hover:underline hover:text-primary transition-colors">
            TV Shows
          </Link>
          <Link to="/auth" className="hover:underline hover:text-primary transition-colors">
            Sign In
          </Link>
        </nav>
      </div>
    </footer>
  );
}
