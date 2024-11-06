import Header from './components/Header';
import { MovieRow } from './components/MovieRow';
import { Banner } from './components/Banner';
import {
  getFeaturedMovieById,
  getMoviesByGenre,
} from './service/MovieService';
import {
  // getMoviesByGenre,
  // getFeaturedMovieById,
} from './service/MovieQuery';

export default async function Home() {
  const featuredMovie = await getFeaturedMovieById('106');
  const GENRES = ['Drama', 'Action', 'Comedy', 'Animation'];

  const movies = await Promise.all(
    GENRES.map(async (genre) => {
      const movies = await getMoviesByGenre(genre, { _limit: 8 });
      return { sectionTitle: genre, movies };
    })
  );

  return (
    <div className='relative bg-gradient-to-b pb-8'>
      <Header />
      <main className='no-scrollbar relative mb-48 h-screen pl-4 lg:pl-16'>
        <Banner movie={featuredMovie} />
        {movies.map((movie) => {
          return (
            <MovieRow
              key={movie.sectionTitle}
              sectionTitle={movie.sectionTitle}
              movies={movie.movies}
            />
          );
        })}
      </main>
    </div>
  );
}
