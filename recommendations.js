// Function to fetch movie info
function searchMovie() {
  const input = document.getElementById('searchInput');
  const query = input.value;

  // fetch through omdb api
  fetch(`https://www.omdbapi.com/?apikey=f26b11a3&t=${query}`)
    .then(response => response.json())
    .then(data => {
      if (data.Response === "True") {
        const imdbId = data.imdbID;

        // Call the getSources function with the IMDB ID
        getSources(imdbId);

        // Call the getTrailer function with the movie title
        getTrailer(data.Title);

        // Call the getRecommendations function with the movie title
        //This is the key line for this function
        getRecommendations(data.Title);

        // Rest of your code for displaying movie info
        const movieInfo = document.getElementById('movieInfo');
        let ratingsHTML = "";
        data.Ratings.forEach(rating => {
          ratingsHTML += `<p>${rating.Source}: ${rating.Value}</p>`;
        });
        movieInfo.innerHTML = `
          <h2>${data.Title}</h2>
          <p>Year: ${data.Year}</p>
          <p>Rating: ${data.Rated}</p>
          <p>Director: ${data.Director}</p>
          <p>Starring: ${data.Actors}</p>
          <p>Plot Synopsis: ${data.Plot}</p>
          ${ratingsHTML}
          <img src="${data.Poster}" alt="${data.Title} Poster">
        `;
      } else {
        const movieInfo = document.getElementById('movieInfo');
        movieInfo.innerHTML = `<p>Movie not found!</p>`;
      }
    })
    .catch(error => {
      console.log(error);
    });

// Function to fetch recommendations
  //this uses the info from the previous call
function getRecommendations(title) {
  fetch(`https://www.omdbapi.com/?apikey=f26b11a3&s=${encodeURIComponent(title)}`)
    .then(response => response.json())
    .then(data => {
      if (data.Response === "True" && data.Search) {
        const recommendationsContainer = document.getElementById('recommendations');
        recommendationsContainer.innerHTML = '';

        data.Search.forEach(result => {
          const recommendation = document.createElement('div');
          recommendation.classList.add('recommendation');

          const poster = document.createElement('img');
          poster.src = result.Poster;
          poster.alt = result.Title;

          const title = document.createElement('p');
          title.textContent = result.Title;

          recommendation.appendChild(poster);
          recommendation.appendChild(title);
          recommendationsContainer.appendChild(recommendation);
        });
      } else {
        const recommendationsContainer = document.getElementById('recommendations');
        recommendationsContainer.innerHTML = `<p>No recommendations found.</p>`;
      }
    })
    .catch(error => {
      console.log(error);
      const recommendationsContainer = document.getElementById('recommendations');
      recommendationsContainer.innerHTML = `<p>Error: ${error.message}</p>`;
    });
}}