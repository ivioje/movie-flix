
import { useEffect, useState } from "react";
import { useUser } from "@clerk/clerk-react";
import { useQuery } from "@tanstack/react-query";
import { getUserData } from "@/services/userServices";
import { SectionHeader } from "@/components/section-header";
import { MovieCard } from "@/components/movie-card";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { Bookmark, Clock, Film, Star } from "lucide-react";
import { Link } from "react-router-dom";

const Dashboard = () => {
  const { user, isSignedIn } = useUser();
  
  const { 
    data: userData, 
    isLoading, 
    error 
  } = useQuery({
    queryKey: ['userData', user?.id],
    queryFn: () => getUserData(user?.id as string),
    enabled: !!user?.id,
  });

  if (isLoading) {
    return (
      <div className="space-y-8">
        <Skeleton className="h-12 w-64" />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {Array(3).fill(0).map((_, i) => (
            <Skeleton key={i} className="h-40 rounded-lg" />
          ))}
        </div>
        <Skeleton className="h-12 w-48 mt-8" />
        <div className="flex gap-4 overflow-hidden">
          {Array(4).fill(0).map((_, i) => (
            <Skeleton key={i} className="w-[200px] aspect-[2/3] rounded-lg flex-shrink-0" />
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center">
        <h2 className="text-2xl font-bold">Error loading profile</h2>
        <p className="text-muted-foreground">Please try again later</p>
      </div>
    );
  }

  const bookmarks = userData?.bookmarks || [];
  const watchHistory = userData?.watchHistory || [];
  
  // Sort watch history by most recent
  const recentWatchHistory = [...watchHistory].sort((a, b) => {
    return new Date(b.watchedAt).getTime() - new Date(a.watchedAt).getTime();
  }).slice(0, 10);

  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <SectionHeader 
        title={`Welcome, ${user?.firstName || user?.username || 'Movie Enthusiast'}`} 
        description="Manage your movie preferences and collections" 
      />
      
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Bookmarked</CardTitle>
            <Bookmark className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{bookmarks.length}</div>
            <p className="text-xs text-muted-foreground mt-1">
              Movies saved for later
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Watch History</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{watchHistory.length}</div>
            <p className="text-xs text-muted-foreground mt-1">
              Movies you've watched
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Favorite Genre</CardTitle>
            <Film className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {userData?.preferences?.favoriteGenre || "Not Set"}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Based on your history
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity */}
      <div>
        <SectionHeader 
          title="Recent Activity" 
          className="mb-6"
        />
        
        <Tabs defaultValue="watch-history">
          <TabsList className="mb-4">
            <TabsTrigger value="watch-history">Watch History</TabsTrigger>
            <TabsTrigger value="bookmarks">Bookmarks</TabsTrigger>
          </TabsList>
          
          <TabsContent value="watch-history">
            {recentWatchHistory.length === 0 ? (
              <div className="text-center py-12 bg-muted/30 rounded-lg">
                <Clock className="h-12 w-12 mx-auto text-muted-foreground" />
                <h3 className="mt-4 text-lg font-medium">No watch history yet</h3>
                <p className="text-muted-foreground">
                  Start watching movies to build your history
                </p>
              </div>
            ) : (
              <ScrollArea>
                <div className="flex gap-4 pb-4">
                  {recentWatchHistory.map((item: any) => (
                    <MovieCard 
                      key={`${item.id}-${item.watchedAt}`}
                      movie={item}
                      className="w-[160px] sm:w-[200px] flex-shrink-0"
                    />
                  ))}
                </div>
                <ScrollBar orientation="horizontal" />
                <div className="mt-4 text-right">
                  <Link to="/history" className="text-sm text-primary hover:underline">
                    View all watch history
                  </Link>
                </div>
              </ScrollArea>
            )}
          </TabsContent>
          
          <TabsContent value="bookmarks">
            {bookmarks.length === 0 ? (
              <div className="text-center py-12 bg-muted/30 rounded-lg">
                <Bookmark className="h-12 w-12 mx-auto text-muted-foreground" />
                <h3 className="mt-4 text-lg font-medium">No bookmarks yet</h3>
                <p className="text-muted-foreground">
                  Bookmark movies to save them for later
                </p>
              </div>
            ) : (
              <ScrollArea>
                <div className="flex gap-4 pb-4">
                  {bookmarks.slice(0, 10).map((movie: any) => (
                    <MovieCard 
                      key={movie.id}
                      movie={movie}
                      className="w-[160px] sm:w-[200px] flex-shrink-0"
                    />
                  ))}
                </div>
                <ScrollBar orientation="horizontal" />
                <div className="mt-4 text-right">
                  <Link to="/bookmarks" className="text-sm text-primary hover:underline">
                    View all bookmarks
                  </Link>
                </div>
              </ScrollArea>
            )}
          </TabsContent>
        </Tabs>
      </div>
      
      {/* Recommendations */}
      <div>
        <SectionHeader 
          title="Recommended For You" 
          description="Based on your watch history"
          className="mb-6"
        />
        
        <div className="text-center py-12 bg-muted/30 rounded-lg">
          <Star className="h-12 w-12 mx-auto text-muted-foreground" />
          <h3 className="mt-4 text-lg font-medium">Coming Soon</h3>
          <p className="text-muted-foreground">
            We're working on personalized recommendations for you
          </p>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
