import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './ReviewForm.css'

function ReviewForm() {
  const [movieTitle, setMovieTitle] = useState('');
  const [rating, setRating] = useState('');
  const [review, setReview] = useState('');
  const [message, setMessage] = useState('');
  const [movies, setMovies] = useState([]);
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();

    const reviews = JSON.parse(localStorage.getItem('reviews')) || {};

    if (reviews[movieTitle]) {
      setMessage('You have already reviewed this movie.');
      return;
    }

    reviews[movieTitle] = { rating, review };
    localStorage.setItem('reviews', JSON.stringify(reviews));

    setMessage('Thank you for your review!');
    setMovieTitle('');
    setRating('');
    setReview('');
  };

  const handleSearch = async (e) => {
    setMovieTitle(e.target.value);

    if (e.target.value.length > 2) {
      try {
        const response = await axios.get(`http://www.omdbapi.com/?s=${e.target.value}&apikey=YOUR_API_KEY`);
        if (response.data.Search) {
          setMovies(response.data.Search);
        } else {
          setMovies([]);
        }
      } catch (error) {
        console.error('Error fetching data from OMDB API', error);
        setMovies([]);
      }
    } else {
      setMovies([]);
    }
  };

  return (
    <div className="container">
      <form onSubmit={handleSubmit}>
        <label htmlFor="movieTitle"></label>
        <input
          type="text"
          id="movieTitle"
          value={movieTitle}
          onChange={handleSearch}
          hidden
          required
        />
         <label htmlFor="email">Mail-ID:</label>
        <input
          type="email"
          id="email"
          value={movieTitle}
          onChange={handleSearch}
          required
         />
        
        {movies.length > 0 && (
          <ul className="movie-list">
            {movies.map((movie) => (
              <li key={movie.imdbID} onClick={() => setMovieTitle(movie.Title)}>
                {movie.Title} ({movie.Year})
              </li>
            ))}
          </ul>
        )}
        
        <label htmlFor="rating">Rating (1-5):</label>
        <input
          type="number"
          id="rating"
          value={rating}
          onChange={(e) => setRating(e.target.value)}
          min="1"
          max="5"
          required
        />
        
        <label htmlFor="review">Review:</label>
        <textarea
          id="review"
          value={review}
          onChange={(e) => setReview(e.target.value)}
          required
        ></textarea>
        
        <button type="submit">Submit</button>
        <div id="message">{message}</div>
      </form>
      <button onClick={() => navigate('/')}>Back to Home</button>
    </div>
  );
}

export default ReviewForm;
