import fetch from 'node-fetch';

const API_URL = 'https://codeflix-api.vercel.app';

const resolvers = {
  Query: {
    async movies() {
      const response = await fetch(`${API_URL}/movies`);
      return await response.json();
    },
    async movie(_, { id }) {
      const response = await fetch(`${API_URL}/movies/${id}`);
      return await response.json();
    },
    async featuredMovies() {
      const response = await fetch(`${API_URL}/featured}`);
      return await response.json();
    },
    async moviesByGenre(_, { genre, limit }) {
      let url = new URL(`${API_URL}/movies`);
      url.searchParams.append('genres_like', genre);

      if (limit) {
        url.searchParams.append('_limit', limit);
      }

      const response = await fetch(url.toString());

      if (!response.ok) {
        throw new Error('Failed to fetch movies');
      }

      return await response.json();
    },
  }
}

export default resolvers;