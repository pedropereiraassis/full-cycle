import { Movie } from '../types/movie';
import { MovieCard } from './MovieCard';

type MovieRowProps = {
  sectionTitle: string;
  movies: Movie[];
};

export const MovieRow = ({ sectionTitle, movies }: MovieRowProps) => {
  return (
    <div className='flex-col space-y-4 pl-2'>
      <div className='flex'>
        <h2 className='-ml-2 inline-flex items-center text-2xl font-bold'>
          {sectionTitle}
        </h2>
      </div>
      <div className='grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-8'>
        {movies.map((movie, index) => {
          return <MovieCard key={movie.id} movie={movie} />;
        })}
      </div>
    </div>
  );
};
