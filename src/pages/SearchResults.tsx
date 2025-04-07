
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { searchMovies } from "@/services/api";
import { MovieCard } from "@/components/movie-card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { Search as SearchIcon } from "lucide-react";

const SearchResults = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const queryParams = new URLSearchParams(location.search);
  const searchQuery = queryParams.get("q") || "";
  const category = queryParams.get("category") || "all";
  
  const [searchTerm, setSearchTerm] = useState(searchQuery);
  const [selectedCategory, setSelectedCategory] = useState(category);

  // Reset search term when query param changes
  useEffect(() => {
    setSearchTerm(searchQuery);
  }, [searchQuery]);

  // Fetch search results
  const { 
    data: searchResults, 
    isLoading,
    error,
    refetch
  } = useQuery({
    queryKey: ['search', searchQuery, selectedCategory],
    queryFn: () => searchMovies(searchQuery),
    enabled: !!searchQuery,
  });

  // Filter results by category if needed
  const filteredResults = searchResults?.filter((item: any) => {
    if (selectedCategory === "all") return true;
    if (selectedCategory === "movie" && item.type === "movie") return true;
    if (selectedCategory === "tv" && item.type === "tv") return true;
    if (selectedCategory === "person" && item.type === "person") return true;
    if (selectedCategory === "trending" && item.trending) return true;
    if (selectedCategory === "popular" && item.popularity > 20) return true;
    if (selectedCategory === "upcoming" && item.coming_soon) return true;
    if (selectedCategory === "topRated" && item.rating > 7.5) return true;
    return false;
  });

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchTerm.trim()) return;
    
    const newParams = new URLSearchParams(location.search);
    newParams.set("q", searchTerm);
    navigate(`/search?${newParams.toString()}`);
    refetch();
  };

  const handleCategoryChange = (value: string) => {
    setSelectedCategory(value);
    const newParams = new URLSearchParams(location.search);
    newParams.set("category", value);
    navigate(`/search?${newParams.toString()}`);
  };

  const renderResultsGrid = () => {
    if (isLoading) {
      return (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
          {Array(12).fill(0).map((_, i) => (
            <div key={i}>
              <Skeleton className="aspect-[2/3] rounded-md" />
              <Skeleton className="h-4 w-full mt-2" />
              <Skeleton className="h-4 w-2/3 mt-1" />
            </div>
          ))}
        </div>
      );
    }

    if (error) {
      return (
        <div className="text-center py-12">
          <h3 className="text-xl font-bold">Error loading results</h3>
          <p className="text-muted-foreground">Please try again later</p>
          <pre className="mt-4 p-4 bg-muted rounded-md text-xs overflow-auto max-w-full">
            {JSON.stringify(error, null, 2)}
          </pre>
        </div>
      );
    }

    if (!searchQuery) {
      return (
        <div className="text-center py-12">
          <h3 className="text-xl font-bold">Enter a search term to find movies</h3>
          <p className="text-muted-foreground">Use the search bar above to find your favorite movies and shows</p>
        </div>
      );
    }

    if (!filteredResults || filteredResults.length === 0) {
      return (
        <div className="text-center py-12">
          <h3 className="text-xl font-bold">No results found</h3>
          <p className="text-muted-foreground">Try searching for something else</p>
        </div>
      );
    }

    return (
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
        {filteredResults.map((movie: any) => (
          <MovieCard key={movie.id} movie={movie} />
        ))}
      </div>
    );
  };

  return (
    <div className="container py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-6">
          {searchQuery ? `Search Results for "${searchQuery}"` : "Search"}
        </h1>
        
        <div className="flex flex-col sm:flex-row gap-4">
          <form onSubmit={handleSearch} className="flex-1 flex gap-2">
            <Input
              type="search"
              placeholder="Search for movies, TV shows..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="flex-1"
            />
            <Button type="submit">
              <SearchIcon className="h-4 w-4 mr-2" />
              Search
            </Button>
          </form>
          
          <Select value={selectedCategory} onValueChange={handleCategoryChange}>
            <SelectTrigger className="w-full sm:w-[180px]">
              <SelectValue placeholder="Category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              <SelectItem value="movie">Movies</SelectItem>
              <SelectItem value="tv">TV Shows</SelectItem>
              <SelectItem value="person">People</SelectItem>
              <SelectItem value="trending">Trending</SelectItem>
              <SelectItem value="popular">Popular</SelectItem>
              <SelectItem value="upcoming">Coming Soon</SelectItem>
              <SelectItem value="topRated">Top Rated</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      
      {/* Results Grid */}
      {renderResultsGrid()}
    </div>
  );
};

export default SearchResults;
