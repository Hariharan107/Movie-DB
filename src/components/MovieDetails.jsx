import { useEffect, useState } from "react";
import StarRating from "../StarRating";
const MovieDetails = ({ selectedId, onClose, onAddMovie, watched }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [rating, setRating] = useState(0);
  const [movie, setMovie] = useState({});

  const API_KEY = "55f4fc6a";
  const {
    Title,
    Year,
    Poster,
    Runtime,
    imdbRating,
    Plot,
    Released,
    Actors,
    Director,
    Genre,
  } = movie;
  const isWatched = watched.map((movie) => movie.imdbID).includes(selectedId);
  const selectedMovieRating = watched.find(
    (movie) => movie.imdbID === selectedId
  )?.userRating;

  useEffect(() => {
    const fetchMovieDetails = async () => {
      setIsLoading(true);
      
      try {
        const res = await fetch(
          `http://www.omdbapi.com/?apikey=${API_KEY}&i=${selectedId}`
        );
        const data = await res.json();
        setMovie(data);
        // console.log(data);
      } catch (err) {
        console.log(err);
        // setIsError(err.message);
      } finally {
        setIsLoading(false);
      }
    };
    fetchMovieDetails();
  }, [selectedId]);
  useEffect(() => {
    if (!Title) return;
    document.title = Title;
    return () => {
      document.title = "Use_Popcorn";
      console.log(`cleanup ${Title}`);
    };
  }, [Title]);
  const handleAddMovie = () => {
    const newWatchedMovie = {
      imdbID: selectedId,
      Title,
      Year,
      Poster,
      userRating: rating,
      Runtime: +Runtime.split(" ").at(0),
      imdbRating: +imdbRating,
    };
    onAddMovie(newWatchedMovie);
  };
  return (
    <div className='details'>
      {isLoading ? (
        <p className='loader'>Loading...</p>
      ) : (
        <>
          <header>
            <button className='btn-back' onClick={onClose}>
              &larr;
            </button>
            <img src={Poster} alt={`Poster of ${movie} movie`} />
            <div className='details-overview'>
              <h2>{Title}</h2>
              <p>
                {Released} &bull; {Runtime}
              </p>
              <p>{Genre}</p>
              <p>
                <span>⭐️</span>
                {imdbRating} IMDb rating
              </p>
            </div>
          </header>
          <section>
            <div className='rating'>
              {!isWatched ? (
                <>
                  <StarRating
                    maxRating={10}
                    size={24}
                    onSetRating={setRating}
                  />
                  {rating > 0 && (
                    <button className='btn-add' onClick={handleAddMovie}>
                      + Add movie to the list
                    </button>
                  )}
                </>
              ) : (
                <p>
                  {`Already watched and rated ${selectedMovieRating}`}
                  <span>⭐</span>{" "}
                </p>
              )}
            </div>

            <p>
              <em>{Plot}</em>
            </p>
            <p>Starring {Actors}</p>
            <p>Directed by {Director}</p>
          </section>
        </>
      )}
    </div>
  );
};

export default MovieDetails;
