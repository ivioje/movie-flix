import { MovieCard } from '@/components/movie-card';
import { Skeleton } from '@/components/ui/skeleton';
import { fetchMovieDetails, fetchMovieList } from '@/services/api';
import { useQueries, useQuery } from '@tanstack/react-query';
import React from 'react';
import { Link } from 'react-router-dom';

// Define the type for a Movie
interface Movie {
  id: string;
  title: string;
  poster?: string;
  rating?: number;
  year?: string | number;
  type?: string;
  videos?: any;
  backdrop_path?: string;
  poster_path?: string;
}

const Movies = () => {
  // Query to get the list of movie changes (movie IDs)
  const { data: movieChanges, isLoading: isMovieChangesLoading } = useQuery({
    queryKey: ['movieChanges'],
    queryFn: fetchMovieList, // this should hit /movie/changes
    refetchOnWindowFocus: false,
  });

  // Extract movie IDs from movieChanges response, slice to limit the number of results
  const movieIds = movieChanges?.results?.map((movie: any) => movie.id).slice(0, 10) || [];

  // Fetch movie details for each movie ID using useQueries
  const movieQueries = useQueries({
    queries: movieIds.map((id) => ({
      queryKey: ['movie', id],
      queryFn: () => fetchMovieDetails(id),
      enabled: !!id,  // Only run query if id exists
    })),
  });

  // Render a loading state
  const Loading = () => (
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

  // Render an error state
  const Error = () => (
    <div className="container py-8 text-center">
      <h2 className="text-2xl font-bold">Error loading movie details</h2>
      <p className="text-muted-foreground">Please try again later</p>
    </div>
  );

  // Handling the rendering of each movie result
  return (
    <div className="pb-12 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
      {movieQueries.map((query, index) => {
        if (query.isLoading) {
          // Instead of returning directly, we render loading placeholders in the loop
          return (
            <div key={index}>
              <Loading />
            </div>
          );
        }

        if (query.error) {
          // If there is an error, render the error message
          return (
            <div key={index}>
              <Error />
            </div>
          );
        }

        // If the movie data is successfully fetched, render the movie card
        const movie = query.data as Movie;

        return (
          <div key={movie.id}>
            <Link to={`/movie/${movie.id}`}>
              <MovieCard movie={movie} />
            </Link>
          </div>
        );
      })}
    </div>
  );
};

export default Movies;
