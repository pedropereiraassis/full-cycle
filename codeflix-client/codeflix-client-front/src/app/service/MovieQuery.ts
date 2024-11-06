import { gql } from '@apollo/client';
import { apolloClient } from '../lib/apolloClient';

export const GET_MOVIES_QUERY = gql`
  query GetMovies {
    movies {
      id
      link
      title
      rating
      genres
      description
      yearLaunched
      thumbFileURL
      videoFileURL
      bannerFileURL
    }
  }
`;

export const GET_MOVIES_BY_ID_QUERY = gql`
  query GetMoviesById($id: ID!) {
    movie(id: $id) {
      id
      link
      title
      rating
      genres
      description
      yearLaunched
      thumbFileURL
      videoFileURL
      bannerFileURL
    }
  }
`;

export const GET_MOVIES_BY_GENRE_QUERY = gql`
  query GetMoviesByGenre($genre: String!) {
    moviesByGenre(genre: $genre) {
      id
      link
      title
      rating
      genres
      description
      yearLaunched
      thumbFileURL
      videoFileURL
      bannerFileURL
    }
  }
`;

export const getMoviesByGenre = async (
  genre: string,
  options: { _limit?: number } = {}
) => {
  const limit = options._limit || 8;
  const { data } = await apolloClient.query({
    query: GET_MOVIES_BY_GENRE_QUERY,
    variables: { genre, limit: limit },
  });

  return data.moviesByGenre;
};

export const getFeaturedMovieById = async (id: string) => {
  const { data } = await apolloClient.query({
    query: GET_MOVIES_BY_ID_QUERY,
    variables: { id },
  });

  return data.movie;
};
