
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { useUser } from "@clerk/clerk-react";
import { fetchMovieDetails, fetchMovieCast } from "@/services/api";
import { bookmarkMovie, removeBookmark, addToWatchHistory, getUserData } from "@/services/userServices";
import { MovieCard } from "@/components/movie-card";
import { Button } from "@/components/ui/button";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "@/components/ui/use-toast";
import { Bookmark, BookmarkCheck, Play, Star, Clock } from "lucide-react";
import { SectionHeader } from "@/components/section-header";

const MovieDetails = () => {
  const { id } = useParams<{ id: string }>();
  const { isSignedIn, user } = useUser();
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
  // Fetch movie details
  const { 
    data: movie,
    isLoading: isMovieLoading,
    error: movieError
  } = useQuery({
    queryKey: ['movie', id],
    queryFn: () => fetchMovieDetails(id || ''),
    enabled: !!id
  });

  // Fetch cast and crew
  const { 
    data: castAndCrew,
    isLoading: isCastLoading,
    error: castError
  } = useQuery({
    queryKey: ['cast', id],
    queryFn: () => fetchMovieCast(id || ''),
    enabled: !!id
  });

  // Check if movie is bookmarked
  useEffect(() => {
    const checkBookmarkStatus = async () => {
      if (isSignedIn && user && id) {
        try {
          const userData = await getUserData(user.id);
          const bookmarks = userData?.bookmarks || [];
          setIsBookmarked(bookmarks.some((item: any) => item.id === id));
        } catch (error) {
          console.error("Error checking bookmark status:", error);
        }
      }
    };

    checkBookmarkStatus();
  }, [id, isSignedIn, user]);

  // Add to watch history when visiting this page
  useEffect(() => {
    const recordWatchHistory = async () => {
      if (isSignedIn && user && movie && !isMovieLoading) {
        try {
          await addToWatchHistory(user.id, movie.id, movie);
        } catch (error) {
          console.error("Error recording watch history:", error);
        }
      }
    };

    recordWatchHistory();
  }, [movie, isMovieLoading, isSignedIn, user]);

  const handleBookmark = async () => {
    if (!isSignedIn || !user || !movie) {
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

  if (isMovieLoading) {
    return (
      <div className="container py-8">
        <div className="flex flex-col md:flex-row gap-8">
          <Skeleton className="w-full md:w-1/3 aspect-[2/3] rounded-md" />
          <div className="w-full md:w-2/3 space-y-4">
            <Skeleton className="h-10 w-3/4" />
            <Skeleton className="h-4 w-1/3" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-2/3" />
          </div>
        </div>
      </div>
    );
  }

  if (movieError || !movie) {
    return (
      <div className="container py-8 text-center">
        <h2 className="text-2xl font-bold">Error loading movie details</h2>
        <p className="text-muted-foreground">Please try again later</p>
      </div>
    );
  }

  return (
    <div className="pb-12">
      {/* Movie backdrop */}
      <div 
        className="relative w-full h-[40vh] md:h-[60vh] bg-cover bg-center"
        style={{ backgroundImage: `url(${movie.backdrop_path || movie.poster_path})` }}
      >
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/70 to-transparent" />
        <div className="container relative h-full"></div>
      </div>

      <div className="container mt-[-150px] md:mt-[-200px] relative z-10">
        <div className="flex flex-col md:flex-row gap-8">
          {/* Movie poster */}
          <div className="w-full md:w-1/4 lg:w-1/5 flex-shrink-0">
            <img 
              src={movie.poster_path || "https://via.placeholder.com/300x450?text=No+Image"} 
              alt={movie.title} 
              className="w-full rounded-md shadow-lg aspect-[2/3] object-cover"
            />
          </div>

          {/* Movie details */}
          <div className="w-full md:w-3/4 lg:w-4/5 space-y-6">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold">{movie.title}</h1>
              <div className="flex flex-wrap items-center gap-3 mt-2 text-sm text-muted-foreground">
                {movie.year && <span>{movie.year}</span>}
                {movie.runtime && (
                  <>
                    <span className="w-1 h-1 rounded-full bg-muted-foreground" />
                    <span>{movie.runtime} min</span>
                  </>
                )}
                {movie.rating && (
                  <>
                    <span className="w-1 h-1 rounded-full bg-muted-foreground" />
                    <div className="flex items-center">
                      <Star className="h-4 w-4 mr-1 text-yellow-500 fill-yellow-500" />
                      <span>{movie.rating.toFixed(1)}</span>
                    </div>
                  </>
                )}
              </div>

              {/* Genres */}
              {movie.genres && movie.genres.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-4">
                  {movie.genres.map((genre: string) => (
                    <span key={genre} className="px-3 py-1 bg-secondary rounded-full text-xs">
                      {genre}
                    </span>
                  ))}
                </div>
              )}
            </div>

            {/* Action buttons */}
            <div className="flex flex-wrap gap-3">
              <Button size="lg" className="gap-2">
                <Play className="h-4 w-4" />
                Watch Trailer
              </Button>
              <Button 
                size="lg" 
                variant={isBookmarked ? "default" : "outline"} 
                onClick={handleBookmark}
                disabled={isLoading}
                className="gap-2"
              >
                {isBookmarked ? (
                  <>
                    <BookmarkCheck className="h-4 w-4" />
                    Bookmarked
                  </>
                ) : (
                  <>
                    <Bookmark className="h-4 w-4" />
                    Bookmark
                  </>
                )}
              </Button>
              <Button size="lg" variant="outline" className="gap-2">
                <Clock className="h-4 w-4" />
                Watch Later
              </Button>
            </div>

            {/* Tabs for overview, cast, details */}
            <Tabs defaultValue="overview" className="mt-8">
              <TabsList className="mb-4">
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="cast">Cast & Crew</TabsTrigger>
                <TabsTrigger value="details">Details</TabsTrigger>
              </TabsList>
              
              <TabsContent value="overview" className="space-y-4">
                {movie.taglines && movie.taglines.length > 0 && (
                  <p className="text-xl italic text-muted-foreground">
                    "{movie.taglines[0]}"
                  </p>
                )}
                
                <h3 className="text-xl font-semibold">Synopsis</h3>
                <p>{movie.plot || "No synopsis available."}</p>
                
                {/* Director */}
                {movie.director && (
                  <div>
                    <h3 className="text-xl font-semibold">Director</h3>
                    <p>{movie.director}</p>
                  </div>
                )}
              </TabsContent>
              
              <TabsContent value="cast">
                {isCastLoading ? (
                  <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                    {Array(6).fill(0).map((_, i) => (
                      <div key={i}>
                        <Skeleton className="aspect-[2/3] rounded-md" />
                        <Skeleton className="h-4 w-full mt-2" />
                      </div>
                    ))}
                  </div>
                ) : castError ? (
                  <p>Failed to load cast information</p>
                ) : (
                  <div>
                    <h3 className="text-xl font-semibold mb-4">Cast</h3>
                    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                      {castAndCrew?.cast?.slice(0, 12).map((person: any) => (
                        <div key={person.id} className="text-center">
                          <img 
                            src={person.profile_path || "https://via.placeholder.com/300x450?text=No+Image"} 
                            alt={person.name} 
                            className="w-full aspect-[2/3] object-cover rounded-md"
                          />
                          <p className="font-medium mt-2">{person.name}</p>
                          <p className="text-sm text-muted-foreground">{person.character}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </TabsContent>
              
              <TabsContent value="details" className="space-y-4">
                {/* Release Information */}
                <div>
                  <h3 className="text-xl font-semibold">Release Information</h3>
                  <p>Release Date: {movie.release_date || "N/A"}</p>
                  {movie.countries_of_origin && (
                    <p>Country of Origin: {movie.countries_of_origin.join(", ")}</p>
                  )}
                </div>
                
                {/* Technical Specifications */}
                {movie.technical_specs && (
                  <div>
                    <h3 className="text-xl font-semibold">Technical Specifications</h3>
                    <ul>
                      {Object.entries(movie.technical_specs).map(([key, value]) => (
                        <li key={key}>
                          <span className="font-medium">{key}: </span>
                          <span>{value as string}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
                
                {/* Box Office */}
                {movie.box_office && (
                  <div>
                    <h3 className="text-xl font-semibold">Box Office</h3>
                    <p>Budget: {movie.box_office.budget || "N/A"}</p>
                    <p>Gross Worldwide: {movie.box_office.gross_worldwide || "N/A"}</p>
                  </div>
                )}
              </TabsContent>
            </Tabs>
          </div>
        </div>

        {/* Similar Movies */}
        {movie.similar_movies && movie.similar_movies.length > 0 && (
          <section className="mt-12">
            <SectionHeader 
              title="You May Also Like" 
              className="mb-6"
            />
            <ScrollArea>
              <div className="flex gap-4 pb-4">
                {movie.similar_movies.map((similarMovie: any) => (
                  <MovieCard 
                    key={similarMovie.id}
                    movie={similarMovie}
                    className="w-[160px] sm:w-[200px] md:w-[240px] flex-shrink-0"
                  />
                ))}
              </div>
              <ScrollBar orientation="horizontal" />
            </ScrollArea>
          </section>
        )}
      </div>
    </div>
  );
};

export default MovieDetails;
