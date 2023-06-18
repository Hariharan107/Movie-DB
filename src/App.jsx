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
  const [selectedId, setSelectedId] = useState("tt1375666");
  const [isLoading, setIsLoading] = useState(false);
  const [query, setQuery] = useState("inception");
  const [error, setIsError] = useState(null);
  const API_KEY = "55f4fc6a";

  useEffect(() => {
    const fetchMovies = async () => {
      setIsError(null);
      setIsLoading(true);
      try {
        const res = await fetch(
          `http://www.omdbapi.com/?apikey=${API_KEY}&s=${query}`
        );
        if (!res.ok) throw new Error("Something went wrong");
        const data = await res.json();
        // console.log(data);
        if (data.Response === "False") {
          throw new Error("Movie not found");
        }
        setMovies(data.Search);
      } catch (err) {
        setIsError(err.message);
      } finally {
        setIsLoading(false);
      }
    };
    if (query.length < 3) {
      setMovies([]);
      setIsError(null);
      return;
    }
    fetchMovies();
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
  return (
    <>
      <NavBar>
        <Search query={query} setQuery={setQuery} />
        <NumResults movies={movies} />
      </NavBar>

      <Main>
        <Box>
          {isLoading && <p className='loader'>Loading...</p>}
          {!isLoading && !error && (
            <MovieList movies={movies} onSelectedMovie={handleSelectMovie} />
          )}
          {error && <p className='error'>{error}</p>}
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
              <WatchedMoviesList watched={watched} />
            </>
          )}
        </Box>
      </Main>
    </>
  );
}
