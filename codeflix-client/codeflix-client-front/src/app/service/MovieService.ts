import { Movie, Movies } from '../types/movie';
import { RequestOptions, apiRequest } from './ApiRequest';

export const getMovieById = async (id: string): Promise<Movie> => {
  return await apiRequest<Movie>(`movies/${encodeURIComponent(id)}`);
};

export const getFeaturedMovieById = async (id: string): Promise<Movie> => {
  return await apiRequest<Movie>(`featured/${encodeURIComponent(id)}`);
};

export const getMoviesByGenre = async (
  genre: string,
  options?: RequestOptions
): Promise<Movies> => {
  return await apiRequest<Movies>(
    `movies`,
    { genres_like: encodeURIComponent(genre) },
    options
  );
};

export const searchMovies = async (
  title: string = '',
  genre: string = '',
  options: RequestOptions = {
    _limit: 100,
  }
): Promise<Movies> => {
  return await apiRequest<Movies>(
    `movies`,
    {
      title_like: encodeURIComponent(title),
      genres_like: encodeURIComponent(genre),
    },
    options
  );
};
