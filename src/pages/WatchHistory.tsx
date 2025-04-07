
import { useEffect, useState } from "react";
import { useUser } from "@clerk/clerk-react";
import { useQuery } from "@tanstack/react-query";
import { clearWatchHistory, getUserData } from "@/services/userServices";
import { MovieCard } from "@/components/movie-card";
import { SectionHeader } from "@/components/section-header";
import { Skeleton } from "@/components/ui/skeleton";
import { Clock, Trash2 } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { toast } from "@/components/ui/use-toast";

const WatchHistory = () => {
  const { user } = useUser();
  const [searchTerm, setSearchTerm] = useState("");
  const [sortOption, setSortOption] = useState("recent");
  const [isDialogOpen, setDialogOpen] = useState(false);
  const [watchHistory, setWatchHistory] = useState<any[]>([]);

  
  const { 
    data: userData, 
    isLoading, 
    error 
  } = useQuery({
    queryKey: ['userData', user?.id],
    queryFn: () => getUserData(user?.id as string),
    enabled: !!user?.id,
  });

  useEffect(() => {
    if (userData?.watchHistory && userData.watchHistory !== watchHistory) {
      setWatchHistory(userData.watchHistory);
    }
  }, [userData]);

  // Filter by search term
  const filteredHistory = watchHistory.filter((item: any) => 
    item.title?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Sort history
  const sortedHistory = [...filteredHistory].sort((a, b) => {
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
    } else if (sortOption === "recent") {
      // Recent first
      return new Date(b.watchedAt).getTime() - new Date(a.watchedAt).getTime();
    } else if (sortOption === "oldest") {
      // Oldest first
      return new Date(a.watchedAt).getTime() - new Date(b.watchedAt).getTime();
    }
    // Default: recent
    return new Date(b.watchedAt).getTime() - new Date(a.watchedAt).getTime();
  });

  const formatWatchDate = (dateString: any) => {
    const milliseconds = dateString.seconds * 1000 + dateString.nanoseconds / 1000000;
    const date = new Date(milliseconds);
    return date.toDateString();
  };

  const handleClearHistory = async () => {
    if (user?.id) {
      if (!watchHistory || watchHistory.length === 0) {
        toast({
          title: "No watch history found",
          description: "You haven't watched anything yet.",
          variant: "destructive",
        });
        setDialogOpen(false);
        return;
      }
      try {
        await clearWatchHistory(user.id);
        setWatchHistory([]);
        toast({
          title: "History Cleared",
          description: "Your watch history has been cleared.",
          variant: "default",
        });
        setDialogOpen(false);
      } catch (error) {
        console.error("Error clearing watch history:", error);
        toast({
          title: "Error",
          description: "There was an error clearing your watch history. Please try again.",
        });
      }
    }
  };
  

  if (isLoading) {
    return (
      <div className="space-y-8">
        <SectionHeader title="Watch History" />
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
        <h2 className="text-2xl font-bold">Error loading watch history</h2>
        <p className="text-muted-foreground">Please try again later</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <SectionHeader 
          title="Watch History" 
          description={`${watchHistory.length} watched movies & shows`}
          className="!mb-0"
        />

        <Dialog open={isDialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button variant="outline" size="sm" className="gap-2">
              <Trash2 className="h-4 w-4" />
              <span className="hidden sm:inline">Clear History</span>
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Clear Watch History</DialogTitle>
              <DialogDescription>
                Are you sure you want to clear your entire watch history? This action cannot be undone.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button variant="outline" onClick={() => setDialogOpen(false)}>Cancel</Button>
              <Button variant="destructive" onClick={handleClearHistory}>Clear History</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <Input
          placeholder="Search watch history..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="flex-1"
        />
        <Select value={sortOption} onValueChange={setSortOption}>
          <SelectTrigger className="w-full sm:w-[180px]">
            <SelectValue placeholder="Sort by" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="recent">Recently Watched</SelectItem>
            <SelectItem value="oldest">Oldest First</SelectItem>
            <SelectItem value="title-asc">Title (A-Z)</SelectItem>
            <SelectItem value="title-desc">Title (Z-A)</SelectItem>
            <SelectItem value="rating-desc">Rating (High to Low)</SelectItem>
            <SelectItem value="year-desc">Year (New to Old)</SelectItem>
            <SelectItem value="year-asc">Year (Old to New)</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Watch history grid */}
      {sortedHistory.length === 0 ? (
        <div className="text-center py-12 bg-muted/30 rounded-lg">
          <Clock className="h-12 w-12 mx-auto text-muted-foreground" />
          <h3 className="mt-4 text-lg font-medium">
            {searchTerm ? "No matching history entries found" : "No watch history yet"}
          </h3>
          <p className="text-muted-foreground">
            {searchTerm 
              ? "Try a different search term"
              : "Start watching movies to build your history"}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6">
          {sortedHistory.map((item: any) => (
            <div key={`${item.id}-${item.watchedAt}`} className="space-y-2">
              <MovieCard movie={item} />
              <div className="text-xs text-muted-foreground text-center">
                Watched: {formatWatchDate(item.watchedAt)}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default WatchHistory;
