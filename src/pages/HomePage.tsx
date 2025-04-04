
import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { fetchTrending, fetchComingSoon, fetchPopular, fetchTopRatedMovies } from "@/services/api";
import { MovieCard } from "@/components/movie-card";
import { SectionHeader } from "@/components/section-header";
import { Button } from "@/components/ui/button";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { Skeleton } from "@/components/ui/skeleton";
import { Play } from "lucide-react";

const HomePage = () => {
  const [heroMovie, setHeroMovie] = useState<any>(null);

  // Fetch trending movies - updated to use the correct endpoint
  const { 
    data: trendingMovies,
    isLoading: isTrendingLoading,
    error: trendingError
  } = useQuery({
    queryKey: ['trending'],
    queryFn: fetchTrending
  });

  // Fetch top rated movies
  const { 
    data: topRatedMovies,
    isLoading: isTopRatedLoading,
    error: topRatedError
  } = useQuery({
    queryKey: ['topRated'],
    queryFn: fetchTopRatedMovies
  });

  // Fetch upcoming movies
  const { 
    data: upcomingMovies,
    isLoading: isUpcomingLoading,
    error: upcomingError
  } = useQuery({
    queryKey: ['upcoming'],
    queryFn: fetchComingSoon
  });

  // Fetch popular movies
  const { 
    data: popularMovies,
    isLoading: isPopularLoading,
    error: popularError
  } = useQuery({
    queryKey: ['popular'],
    queryFn: fetchPopular
  });

  useEffect(() => {
    // Set a random trending movie as hero when data is loaded
    if (trendingMovies?.length > 0) {
      const randomIndex = Math.floor(Math.random() * Math.min(5, trendingMovies.length));
      setHeroMovie(trendingMovies[randomIndex]);
    } else if (topRatedMovies?.length > 0) {
      // Fallback to top rated if trending is empty
      const randomIndex = Math.floor(Math.random() * Math.min(5, topRatedMovies.length));
      setHeroMovie(topRatedMovies[randomIndex]);
    }
  }, [trendingMovies, topRatedMovies]);

  const renderMovieList = (movies: any[], isLoading: boolean, error: any) => {
    if (isLoading) {
      return Array(6).fill(0).map((_, i) => (
        <div key={i} className="w-[160px] sm:w-[200px] md:w-[240px]">
          <Skeleton className="aspect-[2/3] rounded-md" />
          <Skeleton className="h-4 w-full mt-2" />
          <Skeleton className="h-4 w-2/3 mt-1" />
        </div>
      ));
    }

    if (error) {
      return <div className="col-span-full text-center">Failed to load movies</div>;
    }

    if (!movies || movies.length === 0) {
      return <div className="col-span-full text-center">No movies found</div>;
    }

    return movies?.map((movie) => (
      <MovieCard 
        key={movie.id} 
        movie={movie} 
        className="w-[160px] sm:w-[200px] md:w-[240px] flex-shrink-0"
      />
    )) || [];
  };

  return (
    <div className="flex flex-col gap-8 pb-8">
      {/* Hero Section */}
      {heroMovie ? (
        <div 
          className="relative w-full h-[70vh] overflow-hidden bg-cover bg-center"
          style={{ 
            backgroundImage: `url(${heroMovie.poster || heroMovie.poster_path})` 
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/80 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-r from-background to-transparent" />
          
          <div className="container relative h-full flex flex-col justify-end pb-16 md:pb-24 pt-32">
            <div className="max-w-2xl space-y-4">
              <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold tracking-tight animate-fade-in">
                {heroMovie.title}
              </h1>
              
              <div className="flex items-center gap-2 text-sm text-muted-foreground animate-fade-in" style={{animationDelay: "0.2s"}}>
                {heroMovie.year && <span>{heroMovie.year}</span>}
                {heroMovie.rating && (
                  <>
                    <span className="w-1 h-1 rounded-full bg-muted-foreground" />
                    <span>Rating: {heroMovie.rating.toFixed(1)}</span>
                  </>
                )}
              </div>
              
              <div className="flex gap-4 animate-fade-in" style={{animationDelay: "0.4s"}}>
                <Button size="lg" className="gap-2">
                  <Play className="h-4 w-4" />
                  Watch Trailer
                </Button>
                <Button size="lg" variant="outline">More Info</Button>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="w-full h-[50vh] bg-muted/30 flex items-center justify-center">
          <Skeleton className="h-32 w-32 rounded-full" />
        </div>
      )}

      <div className="container space-y-10 mt-8">
        {/* Trending Movies Section */}
        <section>
          <SectionHeader 
            title="Trending Movies" 
            description="Most watched movies this week"
            viewAllLink="/search?category=trending"
            className="mb-6"
          />
          <ScrollArea>
            <div className="flex gap-4 pb-4">
              {renderMovieList(trendingMovies, isTrendingLoading, trendingError)}
            </div>
            <ScrollBar orientation="horizontal" />
          </ScrollArea>
        </section>

        {/* Top Rated Movies Section */}
        <section>
          <SectionHeader 
            title="Top Rated Movies" 
            description="Highest rated movies on IMDB"
            viewAllLink="/search?category=topRated"
            className="mb-6"
          />
          <ScrollArea>
            <div className="flex gap-4 pb-4">
              {renderMovieList(topRatedMovies, isTopRatedLoading, topRatedError)}
            </div>
            <ScrollBar orientation="horizontal" />
          </ScrollArea>
        </section>

        {/* Upcoming Movies Section */}
        <section>
          <SectionHeader 
            title="Coming Soon" 
            description="Upcoming releases to look forward to"
            viewAllLink="/search?category=upcoming"
            className="mb-6"
          />
          <ScrollArea>
            <div className="flex gap-4 pb-4">
              {renderMovieList(upcomingMovies, isUpcomingLoading, upcomingError)}
            </div>
            <ScrollBar orientation="horizontal" />
          </ScrollArea>
        </section>

        {/* Popular Movies Section */}
        <section>
          <SectionHeader 
            title="Popular Movies" 
            description="Fan favorites and critically acclaimed"
            viewAllLink="/search?category=popular"
            className="mb-6"
          />
          <ScrollArea>
            <div className="flex gap-4 pb-4">
              {renderMovieList(popularMovies, isPopularLoading, popularError)}
            </div>
            <ScrollBar orientation="horizontal" />
          </ScrollArea>
        </section>
      </div>
    </div>
  );
};

export default HomePage;
