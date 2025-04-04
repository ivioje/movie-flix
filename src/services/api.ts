
import axios from "axios";

const API_BASE_URL = "https://imdb232.p.rapidapi.com";
const API_KEY = "bb8d917516mshaa036c058796f3cp1baebejsn6ce9e216d638";

// Create a reusable API instance with headers
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'x-rapidapi-key': API_KEY,
    'x-rapidapi-host': 'imdb232.p.rapidapi.com'
  }
});

// Transform the API response to match our app's expected format
const transformMovieData = (data: any) => {
  if (!data || !data.data) return [];
  
  // For trending movies
  if (data.data.topTrendingTitles) {
    return data.data.topTrendingTitles.edges.map((edge: any) => {
      const item = edge.node.item;
      return {
        id: item.primaryTitle?.id || item.id || "",
        title: item.primaryTitle?.titleText?.text || item.name?.value || "",
        poster: item.thumbnail?.url || "",
        year: item.primaryTitle?.releaseYear?.year || new Date().getFullYear(),
        rating: parseFloat(item.ratingsSummary?.aggregateRating || "0") || 0,
        description: item.description?.value || ""
      };
    });
  }
  
  // For search results
  if (data.data.searchResults) {
    return data.data.searchResults.edges.map((edge: any) => {
      const item = edge.node;
      return {
        id: item.id || "",
        title: item.titleText?.text || item.name || "",
        poster: item.primaryImage?.url || "",
        year: item.releaseYear?.year || new Date().getFullYear(),
        type: item.titleType?.text || "Movie",
        rating: parseFloat(item.ratingsSummary?.aggregateRating || "0") || 0
      };
    });
  }
  
  // Handle other response formats
  return data;
};

// API endpoints
export const fetchTrending = async () => {
  try {
    const response = await api.get('/trending');
    return transformMovieData(response.data);
  } catch (error) {
    console.error('Error fetching trending movies:', error);
    throw error;
  }
};

export const fetchMovieDetails = async (id: string) => {
  try {
    const response = await api.get(`/title/details/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching movie details for ID ${id}:`, error);
    throw error;
  }
};

export const fetchMovieCast = async (id: string) => {
  try {
    const response = await api.get(`/title/fullCastAndCrew/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching movie cast for ID ${id}:`, error);
    throw error;
  }
};

export const searchMovies = async (query: string) => {
  try {
    const response = await api.get(`/search/search?query=${encodeURIComponent(query)}`);
    return transformMovieData(response.data);
  } catch (error) {
    console.error(`Error searching for "${query}":`, error);
    throw error;
  }
};

export const fetchActorDetails = async (id: string) => {
  try {
    const response = await api.get(`/actors/overview/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching actor details for ID ${id}:`, error);
    throw error;
  }
};

export const fetchComingSoon = async () => {
  try {
    const response = await api.get('/title/comingSoon');
    return transformMovieData(response.data);
  } catch (error) {
    console.error('Error fetching coming soon movies:', error);
    throw error;
  }
};

export const fetchPopular = async () => {
  try {
    const response = await api.get('/title/mostPopular');
    return transformMovieData(response.data);
  } catch (error) {
    console.error('Error fetching popular movies:', error);
    throw error;
  }
};

export const fetchTopRatedMovies = async () => {
  try {
    const response = await api.get('/title/topRatedMovies');
    return transformMovieData(response.data);
  } catch (error) {
    console.error('Error fetching top rated movies:', error);
    throw error;
  }
};

export const fetchAutoComplete = async (query: string) => {
  try {
    const response = await api.get(`/search/autocomplete?query=${encodeURIComponent(query)}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching autocomplete for "${query}":`, error);
    throw error;
  }
};
