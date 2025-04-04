
import { useState } from "react";
import { useUser } from "@clerk/clerk-react";
import { useQuery } from "@tanstack/react-query";
import { getUserData } from "@/services/userServices";
import { MovieCard } from "@/components/movie-card";
import { SectionHeader } from "@/components/section-header";
import { Skeleton } from "@/components/ui/skeleton";
import { Bookmark } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";

const Bookmarks = () => {
  const { user } = useUser();
  const [searchTerm, setSearchTerm] = useState("");
  const [sortOption, setSortOption] = useState("recent");
  
  const { 
    data: userData, 
    isLoading, 
    error 
  } = useQuery({
    queryKey: ['userData', user?.id],
    queryFn: () => getUserData(user?.id as string),
    enabled: !!user?.id,
  });

  const bookmarks = userData?.bookmarks || [];

  // Filter bookmarks by search term
  const filteredBookmarks = bookmarks.filter((movie: any) => 
    movie.title?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Sort bookmarks
  const sortedBookmarks = [...filteredBookmarks].sort((a, b) => {
    if (sortOption === "title-asc") {
      return a.title.localeCompare(b.title);
    } else if (sortOption === "title-desc") {
      return b.title.localeCompare(a.title);
    } else if (sortOption === "rating-desc") {
      return (b.rating || 0) - (a.rating || 0);
    } else if (sortOption === "year-desc") {
      return (b.year || 0) - (a.year || 0);
    } else if (sortOption === "year-asc") {
      return (a.year || 0) - (b.year || 0);
    }
    // Default: recent (most recently added first)
    return 0;
  });

  if (isLoading) {
    return (
      <div className="space-y-8">
        <SectionHeader title="Bookmarks" />
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
          {Array(12).fill(0).map((_, i) => (
            <div key={i}>
              <Skeleton className="aspect-[2/3] rounded-md" />
              <Skeleton className="h-4 w-full mt-2" />
              <Skeleton className="h-4 w-2/3 mt-1" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center">
        <h2 className="text-2xl font-bold">Error loading bookmarks</h2>
        <p className="text-muted-foreground">Please try again later</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <SectionHeader 
        title="Your Bookmarks" 
        description={`${bookmarks.length} saved movies & shows`}
      />

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <Input
          placeholder="Search bookmarks..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="flex-1"
        />
        <Select value={sortOption} onValueChange={setSortOption}>
          <SelectTrigger className="w-full sm:w-[180px]">
            <SelectValue placeholder="Sort by" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="recent">Recently Added</SelectItem>
            <SelectItem value="title-asc">Title (A-Z)</SelectItem>
            <SelectItem value="title-desc">Title (Z-A)</SelectItem>
            <SelectItem value="rating-desc">Rating (High to Low)</SelectItem>
            <SelectItem value="year-desc">Year (New to Old)</SelectItem>
            <SelectItem value="year-asc">Year (Old to New)</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Bookmarks grid */}
      {sortedBookmarks.length === 0 ? (
        <div className="text-center py-12 bg-muted/30 rounded-lg">
          <Bookmark className="h-12 w-12 mx-auto text-muted-foreground" />
          <h3 className="mt-4 text-lg font-medium">
            {searchTerm ? "No matching bookmarks found" : "No bookmarks yet"}
          </h3>
          <p className="text-muted-foreground">
            {searchTerm 
              ? "Try a different search term"
              : "Start bookmarking movies to save them for later"}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
          {sortedBookmarks.map((movie: any) => (
            <MovieCard key={movie.id} movie={movie} />
          ))}
        </div>
      )}
    </div>
  );
};

export default Bookmarks;
