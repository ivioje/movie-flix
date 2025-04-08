
import axios from "axios";

const API_BASE_URL = import.meta.env.TMDB_BASE_URL;
const API_KEY = import.meta.env.TMDB_API_KEY;
const IMAGE_BASE_URL = import.meta.env.TMDB_IMAGE_URL;

// Create a reusable API instance with common parameters
const api = axios.create({
  baseURL: API_BASE_URL,
  params: {
    api_key: API_KEY,
  }
});

// Helper function to get full image URL with appropriate size
const getImageUrl = (path: string | null, size: string = "w500") => {
  if (!path) return "https://static.vecteezy.com/system/resources/thumbnails/008/202/358/original/animation-loading-circle-icon-loading-gif-loading-screen-gif-loading-spinner-gif-loading-animation-loading-on-black-background-free-video.jpg";
  return `${IMAGE_BASE_URL}${size}${path}`;
};

// Transform TMDB response to match our app's expected format
const transformMovieData = (data: any, type: string = "movie") => {
  if (!data) return [];
  
  if (Array.isArray(data.results)) {
    return data.results.map((item: any) => ({
      id: item.id.toString(),
      title: item.title || item.name,
      poster: getImageUrl(item.poster_path),
      backdrop_path: getImageUrl(item.backdrop_path, "original"),
      year: item.release_date ? new Date(item.release_date).getFullYear() : 
           item.first_air_date ? new Date(item.first_air_date).getFullYear() : 
           new Date().getFullYear(),
      rating: item.vote_average || 0,
      description: item.overview,
      type: item.media_type || type,
      popularity: item.popularity
    }));
  }
  
  return [];
};

// API endpoints
export const fetchTrending = async () => {
  try {
    const response = await api.get('/trending/all/week');
    return transformMovieData(response.data);
  } catch (error) {
    console.error('Error fetching trending movies:', error);
    throw error;
  }
};

export const fetchMovieList = async () => {
  try {
    const response = await api.get('/movie/changes');
    // console.log(response.data);
    return transformMovieData(response.data);
  } catch (error) {
    console.error('Error fetching movie list:', error);
    throw error;
  }
};

export const fetchMovieDetails = async (id: string) => {
  try {
    const response = await api.get(`/movie/${id}`, {
      params: {
        append_to_response: 'credits,similar,videos,keywords'
      }
    });
    
    const directors = response.data.credits?.crew
      ?.filter((person: any) => person.job === 'Director')
      .map((person: any) => person.name) || [];
    
    // Create a structured response with only the fields we need
    return {
      id: response.data.id.toString(),
      title: response.data.title,
      poster_path: getImageUrl(response.data.poster_path),
      backdrop_path: getImageUrl(response.data.backdrop_path, "original"),
      year: response.data.release_date ? new Date(response.data.release_date).getFullYear() : null,
      rating: response.data.vote_average || 0,
      runtime: response.data.runtime,
      plot: response.data.overview,
      taglines: response.data.tagline ? [response.data.tagline] : [],
      genres: response.data.genres?.map((genre: any) => genre.name) || [],
      director: directors.join(', '),
      release_date: response.data.release_date,
      countries_of_origin: response.data.production_countries?.map((country: any) => country.name) || [],
      similar_movies: transformMovieData({ results: response.data.similar?.results || [] }),
      keywords: response.data.keywords?.keywords || [],
      videos: response.data.videos?.results || [],
      // Add empty objects for these fields to fix type errors
      technical_specs: {},
      box_office: {
        budget: "N/A",
        gross_worldwide: "N/A"
      }
    };
  } catch (error) {
    console.error(`Error fetching movie details for ID ${id}:`, error);
    throw error;
  }
};

export const fetchMovieCast = async (id: string) => {
  try {
    const response = await api.get(`/movie/${id}/credits`);
    return {
      cast: (response.data.cast || []).map((person: any) => ({
        id: person.id,
        name: person.name,
        character: person.character,
        profile_path: getImageUrl(person.profile_path, "w185")
      })),
      crew: (response.data.crew || []).map((person: any) => ({
        id: person.id,
        name: person.name,
        job: person.job,
        department: person.department,
        profile_path: getImageUrl(person.profile_path, "w185")
      }))
    };
  } catch (error) {
    console.error(`Error fetching movie cast for ID ${id}:`, error);
    throw error;
  }
};

export const searchMovies = async (query: string) => {
  try {
    const response = await api.get(`/search/multi`, {
      params: {
        query: query,
        include_adult: false,
        language: 'en-US',
        page: 1
      }
    });
    return transformMovieData(response.data);
  } catch (error) {
    console.error(`Error searching for "${query}":`, error);
    throw error;
  }
};

export const fetchActorDetails = async (id: string) => {
  try {
    const [personResponse, creditsResponse] = await Promise.all([
      api.get(`/person/${id}`),
      api.get(`/person/${id}/combined_credits`)
    ]);
    
    return {
      ...personResponse.data,
      profile_path: getImageUrl(personResponse.data.profile_path),
      birthday: personResponse.data.birthday,
      place_of_birth: personResponse.data.place_of_birth,
      biography: personResponse.data.biography,
      known_for_department: personResponse.data.known_for_department,
      credits: {
        cast: transformMovieData({ results: creditsResponse.data.cast }),
        crew: transformMovieData({ results: creditsResponse.data.crew }),
      }
    };
  } catch (error) {
    console.error(`Error fetching actor details for ID ${id}:`, error);
    throw error;
  }
};

export const fetchComingSoon = async () => {
  try {
    const response = await api.get('/movie/upcoming');
    return transformMovieData(response.data, "movie");
  } catch (error) {
    console.error('Error fetching coming soon movies:', error);
    throw error;
  }
};

export const fetchPopular = async () => {
  try {
    const response = await api.get('/movie/popular');
    return transformMovieData(response.data, "movie");
  } catch (error) {
    console.error('Error fetching popular movies:', error);
    throw error;
  }
};

export const fetchTopRatedMovies = async () => {
  try {
    const response = await api.get('/movie/top_rated');
    return transformMovieData(response.data, "movie");
  } catch (error) {
    console.error('Error fetching top rated movies:', error);
    throw error;
  }
};

export const fetchAutoComplete = async (query: string) => {
  try {
    const response = await api.get(`/search/multi`, {
      params: {
        query: query,
        include_adult: false,
        language: 'en-US',
        page: 1
      }
    });
    
    // Return the results directly, not in a nested object
    return response.data.results.slice(0, 7).map((item: any) => ({
      id: item.id,
      title: item.title || item.name,
      media_type: item.media_type,
      year: item.release_date ? 
            new Date(item.release_date).getFullYear() : 
            item.first_air_date ? 
            new Date(item.first_air_date).getFullYear() : null
    }));
  } catch (error) {
    console.error(`Error fetching autocomplete for "${query}":`, error);
    throw error;
  }
};
