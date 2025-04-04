
import axios from "axios";

const API_BASE_URL = "https://imdb232.p.rapidapi.com";
const API_KEY = "bb8d917516mshaa036c058796f3cp1baebejsn6ce9e216d638";

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'x-rapidapi-key': API_KEY,
    'x-rapidapi-host': 'imdb232.p.rapidapi.com'
  }
});

export const fetchTrending = async () => {
  try {
    const response = await api.get('/title/topRatedMovies');
    return response.data;
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
    return response.data;
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
    return response.data;
  } catch (error) {
    console.error('Error fetching coming soon movies:', error);
    throw error;
  }
};

export const fetchPopular = async () => {
  try {
    const response = await api.get('/title/mostPopular');
    return response.data;
  } catch (error) {
    console.error('Error fetching popular movies:', error);
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
