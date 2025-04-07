
import { useState } from "react";
import { Link } from "react-router-dom";
import { useUser } from "@clerk/clerk-react";
import { Bookmark, BookmarkCheck, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { toast } from "@/components/ui/use-toast";
import { bookmarkMovie, removeBookmark } from "@/services/userServices";
import { cn } from "@/lib/utils";

interface MovieCardProps {
  movie: {
    id: string;
    title: string;
    poster?: string;
    rating?: number;
    year?: string | number;
    type?: string;
  };
  variant?: "default" | "large";
  className?: string;
}

export function MovieCard({ movie, variant = "default", className }: MovieCardProps) {
  const { isSignedIn, user } = useUser();
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
  const posterUrl = movie.poster || "https://via.placeholder.com/300x450?text=No+Image";
  
  const releaseYear = typeof movie.year === 'number' 
    ? movie.year 
    : movie.year 
      ? new Date(movie.year).getFullYear() 
      : "N/A";
    
  const handleBookmark = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!isSignedIn || !user) {
      toast({
        title: "Authentication required",
        description: "Please sign in to bookmark movies",
        variant: "destructive",
      });
      return;
    }
    
    setIsLoading(true);
    try {
      if (isBookmarked) {
        await removeBookmark(user.id, movie.id);
        setIsBookmarked(false);
        toast({
          title: "Movie removed from bookmarks",
        });
      } else {
        await bookmarkMovie(user.id, movie.id, movie);
        setIsBookmarked(true);
        toast({
          title: "Movie added to bookmarks",
        });
      }
    } catch (error) {
      console.error("Error updating bookmark:", error);
      toast({
        title: "Error",
        description: "Failed to update bookmark",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Determine link based on content type
  const detailsLink = movie.type === "person" 
    ? `/actor/${movie.id}` 
    : `/movie/${movie.id}`;

  return (
    <Card className={cn(
      "movie-card border-0 bg-transparent overflow-hidden",
      variant === "large" ? "aspect-[2/3] md:aspect-[2/3]" : "aspect-[2/3]",
      className
    )}>
      <Link to={detailsLink} className="block w-full h-full">
        <div className="relative w-full h-full">
          <img 
            src={posterUrl} 
            alt={movie.title} 
            className="w-full h-full object-cover rounded-md"
            loading="lazy"
          />
          <div className="movie-card-overlay absolute inset-0 bg-gradient-to-t from-black/80 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-300">
            <div className="absolute top-2 right-2 z-10">
              {isSignedIn && (
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      size="icon"
                      variant="ghost"
                      className="h-8 w-8 rounded-full bg-black/60 hover:bg-black/80"
                      onClick={handleBookmark}
                      disabled={isLoading}
                    >
                      {isBookmarked ? (
                        <BookmarkCheck className="h-4 w-4 text-primary" />
                      ) : (
                        <Bookmark className="h-4 w-4" />
                      )}
                      <span className="sr-only">
                        {isBookmarked ? "Remove from bookmarks" : "Add to bookmarks"}
                      </span>
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    {isBookmarked ? "Remove from bookmarks" : "Add to bookmarks"}
                  </TooltipContent>
                </Tooltip>
              )}
            </div>
            <div className="movie-info absolute bottom-0 left-0 right-0 p-3">
              <h3 className="text-sm sm:text-base font-medium line-clamp-1 text-white">{movie.title}</h3>
              <div className="flex items-center justify-between mt-1">
                <span className="text-xs text-gray-300">{releaseYear}</span>
                {movie.rating && (
                  <div className="flex items-center">
                    <Star className="h-3 w-3 mr-1 text-yellow-500 fill-yellow-500" />
                    <span className="text-xs text-gray-200">{movie.rating.toFixed(1)}</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </Link>
    </Card>
  );
}
