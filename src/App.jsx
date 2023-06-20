import { useState, useEffect } from "react";
import { NavBar } from "./components/Navbar";
import { Search } from "./components/Search";
import { NumResults } from "./components/NumResults";
import { Main, Box } from "./components/Main";
import { MovieList } from "./components/MovieList";
import { WatchedSummary } from "./components/WatchedSummary";
import { WatchedMoviesList } from "./components/WatchedMoviesList";
import MovieDetails from "./components/MovieDetails";
import { useMovies } from "./components/custom/useMovies";
import { useCallback } from "react";
export default function App() {
  const [query, setQuery] = useState("");
  // const [watched, setWatched] = useState([]);
  const [watched, setWatched] = useState(() =>
    JSON.parse(localStorage.getItem("watched"))
  );
  const [selectedId, setSelectedId] = useState("");
  5;

  const handleCloseMovie = useCallback(() => setSelectedId(null), []);
  const { movies, isLoading, error } = useMovies(query, handleCloseMovie);

  useEffect(() => {
    localStorage.setItem("watched", JSON.stringify(watched));
  }, [watched]);
  const handleSelectMovie = (movieId) => {
    setSelectedId((selectedId) => (movieId === selectedId ? null : movieId));
  };

  const handleWatchedMovie = (movie) => {
    setWatched((watched) => [...watched, movie]);
    handleCloseMovie();
  };
  const handleRemoveWatchedMovie = (movieId) => {
    setWatched(watched.filter((movie) => movie.imdbID !== movieId));
  };

  return (
    <>
      <NavBar>
        <Search query={query} setQuery={setQuery} />
        <NumResults movies={movies} />
      </NavBar>

      <Main>
        <Box>
          {isLoading && <p className='loader'>Loading...</p>}
          {error && <p className='error'>{error}</p>}
          {!isLoading && !error && movies.length > 0 && (
            <MovieList movies={movies} onSelectedMovie={handleSelectMovie} />
          )}
          {!isLoading && !error && movies.length === 0 && (
            <p className='error'>Search your movies</p>
          )}
        </Box>
        <Box>
          {selectedId ? (
            <MovieDetails
              selectedId={selectedId}
              onClose={handleCloseMovie}
              onAddMovie={handleWatchedMovie}
              watched={watched}
            />
          ) : (
            <>
              <WatchedSummary watched={watched} />
              <WatchedMoviesList
                watched={watched}
                onRemoveMovie={handleRemoveWatchedMovie}
              />
            </>
          )}
        </Box>
      </Main>
    </>
  );
}
