import { useState, useEffect } from "react";
import { NavBar } from "./components/Navbar";
import { Search } from "./components/Search";
import { NumResults } from "./components/NumResults";
import { Main, Box } from "./components/Main";
import { MovieList } from "./components/MovieList";
import { WatchedSummary } from "./components/WatchedSummary";
import { WatchedMoviesList } from "./components/WatchedMoviesList";
import MovieDetails from "./components/MovieDetails";

export default function App() {
  const [movies, setMovies] = useState([]);
  const [watched, setWatched] = useState([]);
  const [selectedId, setSelectedId] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [query, setQuery] = useState("");
  const [error, setError] = useState("");

  const KEY = "55f4fc6a";
  useEffect(() => {
    const controller = new AbortController();
    const fetchMovies = async () => {
      try {
        setIsLoading(true);
        setError("");

        const res = await fetch(
          `http://www.omdbapi.com/?apikey=${KEY}&s=${query}`,
          { signal: controller.signal }
        );

        if (!res.ok)
          throw new Error("Something went wrong with fetching movies");

        const data = await res.json();
        if (data.Response === "False") throw new Error("Movie not found");

        setMovies(data.Search);
        setError("");
      } catch (err) {
        if (err.name !== "AbortError") {
          console.log(err.message);
          setError(err.message);
        }
      } finally {
        setIsLoading(false);
      }
    };

    if (query.length < 3) {
      setMovies([]);
      setError("");
      return;
    }

    handleCloseMovie();
    fetchMovies();

    return function () {
      controller.abort();
    };
  }, [query]);

  const handleSelectMovie = (movieId) => {
    setSelectedId((selectedId) => (movieId === selectedId ? null : movieId));
  };
  const handleCloseMovie = () => {
    setSelectedId(null);
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
          {!isLoading && !error && movies.length > 0 ? (
            <MovieList movies={movies} onSelectedMovie={handleSelectMovie} />
          ) : (
            <p className='error'>Search your Movies</p>
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
