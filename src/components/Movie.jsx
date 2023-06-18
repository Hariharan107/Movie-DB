export function Movie({ movie, onSelectedMovie }) {
  if (movie.Poster === "N/A") {
    movie.Poster = "https://avatars.githubusercontent.com/u/111693417?v=4";
  }
  return (
    <li onClick={() => onSelectedMovie(movie.imdbID)}>
      <img src={movie.Poster} alt={`${movie.Title} poster`} />
      <h3>{movie.Title}</h3>
      <div>
        <p>
          <span>🗓</span>
          <span>{movie.Year}</span>
        </p>
      </div>
    </li>
  );
}
