import { WatchedMovie } from "./WatchedMovie";
export function WatchedMoviesList({ watched, onRemoveMovie }) {
  return (
    <ul className='list'>
      {watched.map((movie) => (
        <WatchedMovie
          movie={movie}
          key={movie.imdbID}
          onRemoveMovie={onRemoveMovie}
        />
      ))}
    </ul>
  );
}
